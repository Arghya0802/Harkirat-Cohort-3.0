const express = require("express");
const router = express.Router();

const {
  adminSignup,
  adminLogin,
  getAdminCourses,
} = require("./admin.controller");
const { adminAuth } = require("./middlewares");

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/courses", adminAuth, getAdminCourses);

module.exports = router;
