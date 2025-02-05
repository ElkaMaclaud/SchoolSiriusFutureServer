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
      res.status(500).json({ success: false, message: "Registration error" });
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
      const token = generateAccessToken(user._id, user.email);
      const update = { token };
      await User.findByIdAndUpdate(user._id, update);
      return res.json({ success: true, token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: "Login error" });
    }
  }
  async getData(req, res) {
    try {
      const data = await Lessons.find();
      res.json({
        success: true,
        data: data,
        message: "Данные успешно получены",
      });
    } catch (e) {
      res
        .status(500)
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
  async getLessonsByDate(req, res) {
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
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json({
        success: true,
        data: users,
        message: "Данные успешно получены",
      });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Ошибка получения данных" });
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

        if (timeToNextLesson <= 0) {
          const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          const tomorrowDate = tomorrow.toISOString().slice(0, 10);
          const tomorrowLessons = await Lessons.find({
            date: { $gte: tomorrowDate },
          })
            .sort({ date: 1 })
            .limit(3);

          if (tomorrowLessons.length > 0) {
            const nextLesson = tomorrowLessons[0];
            const nextLessonDate = new Date(nextLesson.date);
            const timeToNextLesson = nextLessonDate.getTime() - now.getTime();

            const daysToNextLesson = Math.max(
              0,
              Math.floor(timeToNextLesson / (1000 * 60 * 60 * 24))
            );
            const hoursToNextLesson = Math.max(
              0,
              Math.floor(
                (timeToNextLesson % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              )
            );
            const minutesToNextLesson = Math.max(
              0,
              Math.floor((timeToNextLesson % (1000 * 60 * 60)) / (1000 * 60))
            );
            const data = {
              lessons: tomorrowLessons,
              timeToNextLesson: {
                days: daysToNextLesson,
                hours: hoursToNextLesson,
                minutes: minutesToNextLesson,
              },
            };
            res.status(200).json({
              success: true,
              data: data,
              message: "Данные успешно получены",
            });
          } else {
            res.status(200).json({ message: "Нет предстоящих уроков" });
          }
        } else {
          const daysToNextLesson = Math.max(
            0,
            Math.floor(timeToNextLesson / (1000 * 60 * 60 * 24))
          );
          const hoursToNextLesson = Math.max(
            0,
            Math.floor(
              (timeToNextLesson % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
          );
          const minutesToNextLesson = Math.max(
            0,
            Math.floor((timeToNextLesson % (1000 * 60 * 60)) / (1000 * 60))
          );
          const data = {
            lessons,
            timeToNextLesson: {
              days: daysToNextLesson,
              hours: hoursToNextLesson,
              minutes: minutesToNextLesson,
            },
          };
          res.status(200).json({
            success: true,
            data,
            message: "Данные успешно получены",
          });
        }
      } else {
        res.status(200).json({ message: "Нет предстоящих уроков" });
      }
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения данных" });
    }
  }
  async createLesson(req, res) {
    try {
      // const lesson = new Lessons(req.body);
      // await Lessons.create(lesson);
      const lesson = new Lessons(req.body);
      await Lessons.save(lesson);
      res.status(201).json({ success: true, message: "Lesson created" });
    } catch {
      res.status(500).json({ success: false, message: "Lessons created" });
    }
  }
  async createLessons(req, res) {
    try {
      if (Array.isArray(req.body)) {
        const lessons = req.body.map(
          ({ lessonName, date, teacher, paid, wasAbsent }) => ({
            lessonName,
            date,
            teacher,
            paid,
            wasAbsent,
          })
        );
        await Lessons.insertMany(lessons);
        res.status(201).json({ success: true, message: "Lessons created" });
      }
    } catch {
      res.status(500).json({ success: false, message: "Invalid request body" });
    }
  }
  async updateLesson(req, res) {
    try {
      const lesson = req.body
      const lessonId = req.body._id;
      await Lessons.findOneAndUpdate({ _id: lessonId }, lesson, { new: true });
    } catch {
      res.status(500).json({ success: false, message: "Lessons created" });
    }
  }
  async updateLessons(req, res) {
    try {
      const lessons = req.body;
      // await Promise.all(lessons.map(lesson => {
      //   return Lessons.updateOne(
      //     { _id: lesson._id },
      //     { $set: lesson }
      //   );
      // }));

      await Lessons.bulkWrite(
        lessons.map((lesson) => {
          if (lesson.modified) {
            return {
              updateOne: {
                filter: { _id: lesson._id },
                update: { $set: { date: lesson.date } },
              },
            };
          }
          return null; 
        }).filter(Boolean)
      );
      res
        .status(200)
        .json({ success: true, message: "Данные успешно обновлены" });
    } catch {
      res
        .status(500)
        .json({ success: false, message: "Ошибка обнговления данных" });
    }
  }
  async deleteLesson(req, res) {
    try {
      const lessonId = req.params.id;
      await Lessons.findByIdAndDelete(lessonId)
    } catch {
      res.status(500).json({ success: false, message: "Lessons created" });
    }
  }
  async deleteLessons(req, res) {
    try {
      const lessons = req.body;
      await Lessons.deleteMany({ _id: { $in: lessons.map((l) => l._id) } });
    } catch {
      res.status(500).json({ success: false, message: "Lessons created" });
    }
  }
}
module.exports = new Controller();
