const express = require("express");
const { adminAuth, userAuth } = require("./middlewares");
const {
  addCourse,
  removeCourse,
  getAllCourses,
  updateCourse,
  purchaseCourse,
} = require("./course.controller");
const router = express.Router();

router.post("/create", adminAuth, addCourse);
router.delete("/remove/:courseId", adminAuth, removeCourse);
router.get("/all", getAllCourses);
router.patch("/update/:courseId", adminAuth, updateCourse);
router.get("/purchase/:courseId", userAuth, purchaseCourse);

module.exports = router;
