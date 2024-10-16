const jwt = require("jsonwebtoken");
const { Todo, User } = require("./db");

const JWT_SECRET = "harkiratCohortIsAmazing...***";

async function auth(req, res, next) {
  const token = req.headers.token;

  if (!token)
    return res.status(403).json({
      message: "Token is required",
      success: false,
    });

  const decodedData = jwt.verify(token, JWT_SECRET);

  const loggedInUser = await User.findById(decodedData._id);

  //   const loggedInUser = await User.findOne({ username: decodedData.username });

  if (!loggedInUser)
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });

  req.user = loggedInUser;
  next();
}

module.exports = { auth, JWT_SECRET };
