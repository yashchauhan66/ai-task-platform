import express from "express"
import auth from "../middleware/authMiddleware.js"
import { createTask, getTask, getTaskById, updateTask } from "../controllers/taskController.js"
const router = express.Router();
router.post("/", auth, createTask)
router.get("/", auth, getTask)
router.get("/:id", auth, getTaskById)
router.put("/:id", auth, updateTask)
export default router