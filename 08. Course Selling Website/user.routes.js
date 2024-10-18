const express = require("express");
const { signup, login, getUserCourses } = require("./user.controller");
const { userAuth, rateLimiter } = require("./middlewares");
const router = express.Router();

router.post("/signup", rateLimiter, signup);
router.post("/login", rateLimiter, login);

router.get("/courses", rateLimiter, userAuth, getUserCourses);

module.exports = router;
