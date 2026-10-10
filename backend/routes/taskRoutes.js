import express from "express";
import {
  createTask,
  deleteTask,
  getRecentTasks,
  getTaskById,
  getTasks,
  getTaskStats,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//create task
router.post("/", protect, createTask);

//get all logged in user tasks
router.get("/", protect, getTasks);

//get dashboard statistics
router.get("/stats", protect, getTaskStats);

//recent task
router.get("/recent", protect, getRecentTasks);

//get single task
router.get("/:id", protect, getTaskById);

//update task
router.put("/:id", protect, updateTask);

//delete task
router.delete("/:id", protect, deleteTask);

export default router;
