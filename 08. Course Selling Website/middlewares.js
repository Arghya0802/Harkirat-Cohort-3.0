const jwt = require("jsonwebtoken");
const { User, Admin } = require("./db");

async function userAuth(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(400).json({
        message: "Token not present",
        success: false,
      });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken)
      return res.status(500).json({
        message: "Something went wrong...",
        success: false,
      });

    const user = await User.findById(decodedToken._id);

    if (!user)
      return res.status(500).json({
        message: "Something went wrong...",
        success: false,
      });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error...",
      success: false,
    });
  }
}

async function adminAuth(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(400).json({
        message: "Token not present",
        success: false,
      });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken)
      return res.status(500).json({
        message: "Something went wrong...",
        success: false,
      });

    const admin = await Admin.findById(decodedToken._id);

    if (!admin)
      return res.status(500).json({
        message: "Something went wrong...",
        success: false,
      });

    req.admin = admin;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error...",
      success: false,
    });
  }
}
module.exports = { userAuth, adminAuth };
