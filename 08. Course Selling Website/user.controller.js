const { User, Course } = require("./db");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function signup(req, res) {
  try {
    const requiredBody = z.object({
      name: z.string().max(30).min(3),
      phone: z.string().min(10).max(10),
      email: z.string().max(100).email(),
      password: z.string().max(30).min(6),
    });

    const { data, success, error } = requiredBody.safeParse(req.body);

    if (!success) {
      console.log(error);
      return res.status(400).json({
        message: "Input Validation error",
        success: false,
      });
    }

    const { name, email, password, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      password: hashedPassword,
      email,
    });

    if (!newUser)
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });

    return res.status(201).json({
      newUser,
      message: "New User has successfully signed-up!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

async function login(req, res) {
  try {
    const reqBody = z.object({
      email: z.string().max(40).email(),
      password: z.string().max(30).min(6),
    });

    const { data, success, error } = reqBody.safeParse(req.body);

    if (!success) {
      console.log(error);
      return res.status(400).json({
        message: "Input Validation Error",
        success: false,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "No User found with given details!",
        success: false,
      });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({
        message: "Unauthorized access!",
        success: false,
      });

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    if (!token)
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });

    // req.headers.token = token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json({
      token,
      message: "User loggedIn successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

async function getUserCourses(req, res) {
  try {
    const user = req.user;
    let myCourses = [];

    for (let i = 0; i < user.courses.length; i++) {
      const course = await Course.findById(user.courses[i]);

      if (!course)
        return res.status(500).json({
          message: "Internal server error",
          success: false,
        });

      myCourses.push(course);
    }

    return res.status(200).json({
      myCourses,
      message: "User courses fetched successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
}

module.exports = {
  signup,
  login,
  getUserCourses,
};
