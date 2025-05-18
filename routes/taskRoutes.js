const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  deleteTask,
  updateTask,
} = require("../Controllers/taskController");
router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router
  .route("/:id")
  .get(protect, getTaskById)
  .delete(protect, deleteTask)
  .put(protect, updateTask);
module.exports = router;
