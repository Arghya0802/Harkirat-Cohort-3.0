const express = require("express");
const { adminAuth, userAuth, rateLimiter } = require("./middlewares");
const {
  addCourse,
  removeCourse,
  getAllCourses,
  updateCourse,
  purchaseCourse,
} = require("./course.controller");
const router = express.Router();

router.post("/create", rateLimiter, adminAuth, addCourse);
router.delete("/remove/:courseId", rateLimiter, adminAuth, removeCourse);
router.get("/all", rateLimiter, getAllCourses);
router.patch("/update/:courseId", rateLimiter, adminAuth, updateCourse);
router.get("/purchase/:courseId", rateLimiter, userAuth, purchaseCourse);

module.exports = router;
