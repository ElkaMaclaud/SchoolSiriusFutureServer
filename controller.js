const User = require("./models/User");
const Lessons = require("./models/Lessons");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const generateAccessToken = require("./utils/generateAccessToken");

class Controller {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ success: false, message: "Ошибка при регистрации" });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким именем уже существует",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ email, password: hashPassword });
      await user.save();

      return res.json({
        success: true,
        messsage: "Пользователь был успешно заригистрирован",
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: `Пользователь с таким ${email} не найден`,
        });
      }
      const validatePassword = bcrypt.compareSync(password, user.password);
      if (!validatePassword) {
        return res
          .status(400)
          .json({ success: false, message: `Введен неверный пароль` });
      }
      const token = generateAccessToken(user._id);
      const update = { token };
      await User.findByIdAndUpdate(user._id, update);
      return res.json({ success: true, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ success: false, message: "Login error" });
    }
  }
  async getData(req, res) {
    try {
      //const data = await readFileData();
      const data = await Lessons.find();
      res.json({
        success: true,
        data: data,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
  async getLessonsName(req, res) {
    try {
      const data = await Lessons.find({ lessonName: req.body.name });
      res.json({
        success: true,
        data: data,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }
  async getLessonsDate(req, res) {
    try {
      const { name, startDate, endDate } = req.body;

      const data = await Lessons.find({
        lessonName: name,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      res.json({
        success: true,
        data: data,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }

  async createLesson(req, res) {
    if (Array.isArray(req.body)) {
      const lessons = req.body.map(({ lessonName, date, teacher }) => ({
        lessonName,
        date,
        teacher,
      }));
      await Lessons.insertMany(lessons);
      res.status(201).json({ message: "Lessons created" });
    } else {
      res.status(400).json({ message: "Invalid request body" });
    }
  }
  async getLessonCounts(req, res) {
    try {
      const lessonCounts = await Lessons.aggregate([
        { $group: { _id: "$lessonName", count: { $sum: 1 } } },
        { $project: { _id: 0, lessonName: "$_id", count: 1 } },
      ]);

      const result = {};
      lessonCounts.forEach((item) => {
        result[item.lessonName] = item.count;
      });

      res.json({
        success: true,
        data: result,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
    }
  }

  async getUpcomingLessons(req, res) {
    try {
      const now = new Date();
      const currentDate = now.toISOString().slice(0, 10);
      const lessons = await Lessons.find({
        date: { $gte: currentDate },
      })
        .sort({ date: 1 })
        .limit(3);

      if (lessons.length > 0) {
        const nearestLesson = lessons[0];
        const dateFromString = new Date(nearestLesson.date); 
        const timeToNextLesson = dateFromString.getTime() - now.getTime();

        const daysToNextLesson = Math.floor(
          timeToNextLesson / (1000 * 60 * 60 * 24)
        );
        const hoursToNextLesson = Math.floor(
          (timeToNextLesson % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesToNextLesson = Math.floor(
          (timeToNextLesson % (1000 * 60 * 60)) / (1000 * 60)
        );

        res.status(200).json({
          lessons,
          timeToNextLesson: {
            days: daysToNextLesson,
            hours: hoursToNextLesson,
            minutes: minutesToNextLesson,
          },
        });
      } else {
        res.status(200).json({ message: "No upcoming lessons found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new Controller();
