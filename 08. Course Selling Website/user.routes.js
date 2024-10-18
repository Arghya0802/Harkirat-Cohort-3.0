const express = require("express");
const { signup, login, getUserCourses } = require("./user.controller");
const { userAuth } = require("./middlewares");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/courses", userAuth, getUserCourses);

module.exports = router;
