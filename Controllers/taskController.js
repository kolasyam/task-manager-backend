const asyncHandler = require("express-async-handler");
const Task = require("../Models/Task");

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized: User not logged in");
  }

  const taskCount = await Task.countDocuments({
    createdBy: req.user._id,
  });

  //   if (taskCount >= 4) {
  //     res.status(400).json({ message: "Task limit is over" }); // Send a structured response
  //     return;
  //   }

  const taskExists = await Task.findOne({
    title,
    createdBy: req.user._id,
  });

  if (taskExists) {
    res.status(400).json({ message: "Task already exists" }); // Ensure a structured error message
    return;
  }

  const task = await Task.create({
    title,
    description,
    createdBy: req.user._id, // Associate project with logged-in user
  });

  if (task) {
    res.status(201).json({
      _id: task._id,
      title: task.title,
      description: task.description,
      createdBy: task.createdBy,
    });
  } else {
    res.status(400).json({ message: "Invalid project data" });
  }
});

const getTasks = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized: Admin not logged in");
  }

  const tasks = await Task.find({ createdBy: req.user._id });
  if (tasks.length === 0) {
    return res.status(200).json({ message: "No tasks are present." });
  }

  res.status(200).json(tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error("Task not found");
  }
});
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Optional: Only allow user to delete their own project
  if (task.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this Task");
  }

  await task.deleteOne(); // safer than `remove()`, use `deleteOne()`

  res.status(200).json({ message: "Task deleted successfully" });
});
const updateTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check if user is the owner of the task
  if (task.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this task");
  }

  // Check if another task with the same title and description already exists for the user
  const duplicateTask = await Task.findOne({
    _id: { $ne: task._id }, // exclude current task
    createdBy: req.user._id,
    title: title || task.title,
    description: description || task.description,
  });

  if (duplicateTask) {
    res.status(400);
    throw new Error(
      "A task with the same title and description already exists"
    );
  }

  // Update only if fields are provided
  if (title) task.title = title;
  if (description) task.description = description;

  const updatedTask = await task.save();

  res.status(200).json(updatedTask);
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  deleteTask,
  updateTask,
};
