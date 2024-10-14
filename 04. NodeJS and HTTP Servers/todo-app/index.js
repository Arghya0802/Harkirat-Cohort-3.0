const express = require("express");
const app = express();

app.use(express.json());

// For Todo Application, we need 4 endpoints:
// a) GET:      To show all todos
// b) POST:     To add a new Todo
// c) PUT:      To update an existing Todo
// d) DELETE:   To delete an existing Todo

let todos = [];

app.get("/", function (req, res) {
  //   res.send("Hello World");
  return res.status(200).json({
    todos,
    message: "All todos fetched successfully!!!",
    success: true,
  });
});

app.post("/create", function (req, res) {
  const { id, title } = req.body;

  if (!id || !title)
    return res.status(400).json({
      message: "Id or Title must be passed",
      success: false,
    });

  todos.push({
    id,
    title,
  });

  return res.status(201).json({
    todos,
    message: "New todo created successfully!!!",
    success: true,
  });
});

app.patch("/update", function (req, res) {
  const { id, updatedTask } = req.body;

  if (!id || !updatedTask)
    return res.status(400).json({
      message: "Id or new title is required",
      success: false,
    });

  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1)
    return res.status(404).json({
      message: "No Todo found with given Id",
      success: false,
    });

  todos[index].title = updatedTask;

  return res.status(200).json({
    updatedTodo: todos[index],
    message: "Given Todo updated successfully",
    success: true,
  });
});

app.delete("/delete", function (req, res) {
  const { id } = req.body;

  if (!id)
    return res.status(400).json({
      message: "Id is required",
      success: false,
    });

  //   console.log(typeof id);

  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1)
    return res.status(404).json({
      message: "No Todo found with given Id",
      success: false,
    });

  //   console.log(index);

  todos.splice(index, 1);

  //   newTodos = todos.filter((todo) => todo.id !== id);

  //   let newTodos = [];

  //   for (let i = 0; i < todos.length; i++) {
  //     if (todos[i].id !== id) newTodos.push(todos[i]);
  //   }

  //   todos = newTodos;

  return res.status(200).json({
    todos,
    message: "Given Todo has been successfully deleted",
    success: true,
  });
});

app.listen(3000);
