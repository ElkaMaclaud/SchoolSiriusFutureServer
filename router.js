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
router.post("/lessons", authMiddleware, controller.createLesson);
router.post("/lessonsByDate", authMiddleware, controller.getLessonsByDate);
router.post("/updateLessons", authMiddleware, controller.updateLessons);
router.get("/getUsers", authMiddleware, controller.getAllUsers);
router.get("/lessonsName", authMiddleware, controller.getLessonsName);
router.get("/lessonCounts", authMiddleware, controller.getLessonCounts);
router.get("/upcomingLessons", authMiddleware, controller.getUpcomingLessons);




module.exports = router;
