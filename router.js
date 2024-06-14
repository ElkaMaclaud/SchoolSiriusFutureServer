const controller = require("./controller");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const router = express.Router(); 

router.post(
  "/registration",
  [
    check("email", "Имя пользователя не может быть пустым").notEmpty(),
    check(
      "password",
      "Пароль должен быть более 4 символов и не более 18 символов"
    )
      .notEmpty()
      .isLength({ min: 4, max: 18 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.post("/lessons", controller.createLesson);
router.post("/lessonsDate", controller.getLessonsDate);
router.get("/getUsers", controller.getAllUsers);
router.get("/lessonsName", controller.getLessonsName);
router.get("/lessonCounts", controller.getLessonCounts);
router.get("/upcomingLessons", controller.getUpcomingLessons);



module.exports = router;
