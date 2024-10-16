const { User, Todo } = require("./db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./middlewares");

const bcrypt = require("bcrypt");
const { z } = require("zod");

async function signup(req, res) {
  try {
    const requiredBody = z.object({
      username: z.string().min(3).max(20),
      email: z.string().min(3).max(25).email(),
      password: z.string().min(5).max(30),
    });

    const { data, success, error } = requiredBody.safeParse(req.body);

    if (!success)
      return res.status(401).json({
        error,
        message: "Input validation failed",
        success: false,
      });

    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });

    //   const user = await User.findOne({ $or: [{ username }, { email }] });
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user)
      return res.status(401).json({
        message: "Given Username or Email-Id is already in use!",
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword)
      return res.status(500).json({
        message: "Internal Server Error!",
        success: false,
      });

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!newUser)
      return res.status(500).json({
        message: "Something went wrong while creating a new User!",
        success: false,
      });

    return res.status(201).json({
      newUser,
      message: "New User has been created successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
}

async function login(req, res) {
  try {
    const requiredBody = z.object({
      username: z.string().min(3).max(20),
      password: z.string().min(3).max(30),
    });

    const { data, success, error } = requiredBody.safeParse(req.body);

    if (!success) {
      return res.status(401).json({
        error,
        message: "Input Error Validation",
        success: false,
      });
    }
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({
        message: "All the fields are required!",
        success: false,
      });

    const user = await User.findOne({ username });

    if (!user)
      return res.status(404).json({
        message: "No user found with given credentials!",
        success: false,
      });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({
        message: "Unauthorized Access!",
        success: false,
      });
    }

    // if (user.password !== password)
    //   return res.status(403).json({
    //     message: "Unauthorized Access!",
    //     success: false,
    //   });

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      JWT_SECRET
    );
    req.headers.token = token;

    return res.status(200).json({
      username: user.username,
      token,
      message: "User loggedIn successfully!!!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong....",
      success: false,
    });
  }
}

async function createTodo(req, res) {
  try {
    const requiredBody = z.object({
      title: z.string().min(3).max(20),
      description: z.string(3).max(100),
    });

    const { data, success, error } = requiredBody.safeParse(req.body);

    if (!success) {
      return res.status(401).json({
        error,
        message: "Input failed validation",
        success: false,
      });
    }
    const { title, description } = req.body;

    if (!title || !description)
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });

    const user = req.user;

    const newTodo = await Todo.create({ title, description, author: user._id });

    if (!newTodo)
      return res.status(500).json({
        message: "Something went wrong while creating a new Todo!",
        success: false,
      });

    return res.status(201).json({
      newTodo,
      message: "New Todo has been successfully created!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong....",
      success: false,
    });
  }
}

async function getAllTodos(req, res) {
  try {
    const user = req.user;

    const todos = await Todo.find({ author: user._id });

    return res.status(200).json({
      todos,
      message: "All Todos fetched!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong....",
      success: false,
    });
  }
}

async function updateTodo(req, res) {
  try {
    const requiredBody = z.object({
      title: z.string().min(3).max(20).optional(),
      description: z.string().min(3).max(100).optional(),
    });
    const { data, success, error } = requiredBody.safeParse(req.body);

    if (!success) {
      return res.status(401).json({
        error,
        message: "Input Error Validation",
        success: false,
      });
    }
    const user = req.user;
    const { todoId } = req.params;

    const todo = Todo.findById(todoId);

    if (!todo)
      return res.status(404).json({
        message: "No Todo found!",
        success: false,
      });

    const { title, description } = req.body;

    const newTodo = await Todo.findByIdAndUpdate(
      todoId,
      {
        title,
        description,
      },
      { new: true }
    );

    if (!newTodo)
      return res.status(500).json({
        message: "Something went wrong while updating the Todo...",
        success: false,
      });

    return res.status(200).json({
      newTodo,
      message: "Todo updated successfully!",
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

async function removeTodo(req, res) {
  try {
    const { todoId } = req.params;

    if (!todoId)
      return res.status(400).json({
        message: "No TodoId found!",
        success: false,
      });

    const todo = await Todo.findByIdAndDelete(todoId);

    if (!todo)
      return res.status(404).json({
        message: "No Todo found with given todoID",
        success: false,
      });

    return res.status(200).json({
      todo,
      message: "Todo deleted successfully!",
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

async function changeTodoStatus(req, res) {
  try {
    const { todoId } = req.params;

    if (!todoId)
      return res.status(400).json({
        message: "No TodoId found",
        success: false,
      });

    const todo = await Todo.findById(todoId);

    if (!todo)
      return res.status(404).json({
        message: "No Todo found with given todoId",
        success: false,
      });

    todo.isCompleted = !todo.isCompleted;

    const newTodo = await todo.save({ validateBeforeSave: false });

    if (!newTodo)
      return res.status(500).json({
        message: "Something went wrong while updating the todo...",
        success: false,
      });

    return res.status(200).json({
      todo,
      message: "Todo updated successfully!",
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

module.exports = {
  signup,
  login,
  createTodo,
  getAllTodos,
  updateTodo,
  removeTodo,
  changeTodoStatus,
};
