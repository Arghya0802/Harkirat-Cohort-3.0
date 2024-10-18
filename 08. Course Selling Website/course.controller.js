const { Course, Purchase } = require("./db");
const { z } = require("zod");

async function addCourse(req, res) {
  try {
    const admin = req.admin;

    // if (admin.designation !== "admin")
    //   return res.status(403).json({
    //     message: "Unauthorized Access!",
    //     success: false,
    //   });

    const reqBody = z.object({
      title: z.string().min(10).max(50),
      description: z.string().min(10).max(150),
      slides: z.string().optional(),
      duration: z.string(),
      file: z.string().optional(),
    });

    const { data, success, error } = reqBody.safeParse(req.body);

    if (!success) {
      console.log(error);
      return res.status(400).json({
        message: "Input Validation error",
        success: false,
      });
    }

    const { title, description, slides, duration, file } = req.body;

    const newCourse = await Course.create({
      title,
      description,
      slides: slides ? slides : "",
      duration,
      file: file ? file : "",
      author: admin._id,
    });

    if (!newCourse)
      return res.status(500).json({
        message: "Internal Server error",
        success: false,
      });

    // Instead of storing the courses in myCourse[], we have an author associated with it
    // This will help us to delete the courses easily
    // For users, I have used an [] as that feels more convenient

    return res.status(201).json({
      newCourse,
      message: "New Course has been successfully created!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong...",
      success: false,
    });
  }
}

async function removeCourse(req, res) {
  try {
    const admin = req.admin;

    // if (admin.designation !== "admin")
    //   return res.status(401).json({
    //     message: "Unauthorized success",
    //     success: false,
    //   });

    const { courseId } = req.params;

    if (!courseId)
      return res.status(400).json({
        message: "No courseId found!",
        success: false,
      });

    const course = await Course.findByIdAndDelete(courseId);

    if (!course)
      return res.status(404).json({
        message: "No course found",
        success: false,
      });

    return res.status(200).json({
      course,
      message: "Course deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong...",
      success: false,
    });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      courses,
      message: "All courses fetched successfully!",
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

async function updateCourse(req, res) {
  try {
    const reqBody = z.object({
      title: z.string().min(10).max(50).optional(),
      description: z.string().min(10).max(150).optional(),
      slides: z.string().optional(),
      duration: z.string().optional(),
      file: z.string().optional(),
    });

    const { data, success, error } = reqBody.safeParse(req.body);

    if (!success) {
      console.log(error);
      return res.status(400).json({
        message: "Input Validation error",
        success: false,
      });
    }
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course)
      return res.status(404).json({
        message: "No course found with given courseId",
        success: false,
      });

    const { title, description, slides, duration, file } = req.body;
    let myObj = {};

    if (title) myObj.title = title;
    if (description) myObj.description = description;
    if (slides) myObj.slides = slides;
    if (duration) myObj.description = description;
    if (file) myObj.file = file;

    const newCourse = await Course.findByIdAndUpdate(courseId, myObj, {
      new: true,
    });

    if (!newCourse)
      return res.status(500).json({
        message: "Something went wrong...",
        success: false,
      });

    return res.status(200).json({
      newCourse,
      message: "Given course updated successfully!",
      success: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
}

async function purchaseCourse(req, res) {
  try {
    const user = req.user;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course)
      return res.status(404).json({
        message: "No course found with given courseId",
        success: false,
      });

    const newPurchase = await Purchase.create({
      userId: user._id,
      courseId: course._id,
      isTransactionDone: true,
    });

    if (!newPurchase)
      return res.status(500).json({
        message: "Something went wrong...",
        success: false,
      });

    user.courses.push(course._id);
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      newPurchase,
      userCourses: user.courses,
      message: "User has purchased the course successfully!",
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
  addCourse,
  removeCourse,
  getAllCourses,
  updateCourse,
  purchaseCourse,
};
