const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to DB successfully!!!");

  app.listen(process.env.PORT, () => {
    console.log(`App is listening at ${process.env.PORT}!!!`);
  });
});

const userRouter = require("./user.routes");
app.use("/user", userRouter);

const adminRouter = require("./admin.routes");
app.use("/admin", adminRouter);

const courseRouter = require("./course.routes");
app.use("/course", courseRouter);
