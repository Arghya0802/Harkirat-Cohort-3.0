const express = require("express");
const router = express.Router();

const {
  adminSignup,
  adminLogin,
  getAdminCourses,
} = require("./admin.controller");
const { adminAuth, rateLimiter } = require("./middlewares");

router.post("/signup", rateLimiter, adminSignup);
router.post("/login", rateLimiter, adminLogin);
router.get("/courses", rateLimiter, adminAuth, getAdminCourses);

module.exports = router;
