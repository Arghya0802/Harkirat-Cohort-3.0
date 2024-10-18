const { Admin, Course } = require("./db");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function adminSignup(req, res) {
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

    const { name, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword)
      return res.status(500).json({
        message: "Internal Server error",
        success: false,
      });
    const newAdmin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    if (!newAdmin)
      return res.status(500).json({
        message: "Something went wrong...",
        success: false,
      });

    return res.status(201).json({
      newAdmin,
      message: "New Admin successfully!",
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

async function adminLogin(req, res) {
  try {
    const reqBody = z.object({
      email: z.string().min(3).max(100),
      password: z.string().min(6).max(20),
    });

    const { data, success, error } = reqBody.safeParse(req.body);

    if (!success) {
      console.log(error);

      return res.status(400).json({
        message: "Input Validation error",
        success: false,
      });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin)
      return res.status(404).json({
        message: "No admin found!",
        success: false,
      });

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect)
      return res.status(401).json({
        message: "Unauthorized access!",
        succesS: false,
      });

    const token = jwt.sign(
      {
        _id: admin._id,
      },
      process.env.JWT_SECRET
    );

    if (!token)
      return res.status(500).json({
        message: "Internal Server error",
        success: false,
      });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      token,
      message: "Admin loggedIn successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong...",
      success: false,
    });
  }
}

async function getAdminCourses(req, res) {
  try {
    const admin = req.admin;
    let myCourses = [];

    const courses = await Course.find();

    myCourses = courses.filter(
      (course) => course.author.toString() === admin._id.toString()
    );

    return res.status(200).json({
      myCourses,
      message: "Admin courses fetched successfully!",
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
  adminLogin,
  adminSignup,
  getAdminCourses,
};
