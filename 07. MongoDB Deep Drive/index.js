const {
  signup,
  login,
  createTodo,
  getAllTodos,
  updateTodo,
  removeTodo,
  changeTodoStatus,
} = require("./controller");
const { auth } = require("./middlewares");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URI = "mongodb://localhost:27017/100xDevs";

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB successfully!!!");
    app.listen(3000, () => {
      console.log("App is listening at Port 3000");
    });
  })
  .catch((error) => {
    console.log("Error: " + error);
  });

app.post("/signup", signup);
app.post("/login", login);
app.post("/todo", auth, createTodo);
app.get("/todos", auth, getAllTodos);
app.patch("/update/:todoId", auth, updateTodo);
app.delete("/delete/:todoId", auth, removeTodo);
app.get("/change-todo-status/:todoId", auth, changeTodoStatus);
