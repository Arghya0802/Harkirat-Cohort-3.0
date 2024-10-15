const jwt = require("jsonwebtoken");
const JWT_SECRET = "harkiratcohort3.0";
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("./public"));

let users = []; // In memory users DB

app.get("/", function (req, res) {
  return res.status(200).json({
    message: "Home Route is working fine!",
    success: true,
  });
});

function generateToken(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      message: "Both username and password required!!!",
      success: false,
    });

  const index = users.findIndex(
    (user) => user.username === username && user.password === password
  );

  if (index === -1)
    return res.status(400).json({
      message: "No user found with given credentials!",
      success: false,
    });
  //   const options = [
  //     "a",
  //     "b",
  //     "c",
  //     "d",
  //     "e",
  //     "f",
  //     "g",
  //     "h",
  //     "i",
  //     "j",
  //     "k",
  //     "l",
  //     "m",
  //     "n",
  //     "o",
  //     "p",
  //     "q",
  //     "r",
  //     "s",
  //     "t",
  //     "u",
  //     "v",
  //     "w",
  //     "x",
  //     "y",
  //     "z",
  //     "A",
  //     "B",
  //     "C",
  //     "D",
  //     "E",
  //     "F",
  //     "G",
  //     "H",
  //     "I",
  //     "J",
  //     "K",
  //     "L",
  //     "M",
  //     "N",
  //     "O",
  //     "P",
  //     "Q",
  //     "R",
  //     "S",
  //     "T",
  //     "U",
  //     "V",
  //     "W",
  //     "X",
  //     "Y",
  //     "Z",
  //     "0",
  //     "1",
  //     "2",
  //     "3",
  //     "4",
  //     "5",
  //     "6",
  //     "7",
  //     "8",
  //     "9",
  //   ];

  //   let token = "";

  //   for (let i = 0; i < 32; i++) {
  //     token += options[Math.floor(Math.random() * options.length)];
  //   }

  req.token = jwt.sign({ username }, JWT_SECRET);
  next();
}

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.token;

    if (!token)
      return res.status(401).json({
        message: "Unauthorized Access!!!",
        success: false,
      });

    const user = jwt.verify(token, JWT_SECRET);
    console.log(user);

    req.user = user.username;
    next();
  } catch (error) {
    return res.status(403).json({
      message: error.message,
      success: false,
    });
  }
}

app.post("/signup", function (req, res) {
  const { username, password } = req.body;
  //   const token = req.token;

  if (!username || !password) {
    return res.status(400).json({
      message: "Both username and password is required",
      success: false,
    });
  }
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user)
    return res.status(403).json({
      message: "User already exists",
      success: false,
    });

  users.push({
    username,
    password,
  });

  return res.status(200).json({
    users,
    message: "User has successfully signed-in!",
    success: true,
  });
});

app.post("/signin", generateToken, function (req, res) {
  //   const { username, password } = req.body;
  const token = req.token;

  //   const foundUser = users.find(
  //     (user) => user.username === username && user.password === password
  //   );

  //   foundUser.token = token;

  return res.status(200).json({
    token,
    message: "User loggedIn successfully!",
    success: true,
  });
});

app.get("/me", authMiddleware, function (req, res) {
  const username = req.user;
  //   console.log(typeof username);

  const loggedInUser = users.find((user) => user.username === username);
  //   console.log(loggedInUser);

  return res.status(200).json({
    username: loggedInUser.username,
    password: loggedInUser.password,
    message: "User is logged-in successfully!!!",
    success: true,
  });
});

app.listen(3000, () => {
  console.log("App is listening at Port 3000!!!");
});
