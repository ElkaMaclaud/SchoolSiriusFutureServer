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
      const data = await Data.find();
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
      const data = await Lessons.find({lessonName: req.body.name});
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
      const data = await Lessons.find({
        lessonName: req.body.name, 
        date: {  
        $gte: startDate, 
        $lte: endDate,  } 
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
      const lessons = req.body.map(({ lessonName, date }) => ({ lessonName, date }));
      await Lessons.insertMany(lessons);
      res.status(201).json({ message: 'Lessons created' });
    } else {
      res.status(400).json({ message: 'Invalid request body' });
    }
  }
  
  
}


module.exports = new Controller();
