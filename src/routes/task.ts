import { Router } from "express";
import {
  getAllTasksController,
  getTaskByIdController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
  updateTaskStatusController,
} from "@/controllers/task";

const router: Router = Router();

router.get("/tasks", getAllTasksController);
router.get("/tasks/:id", getTaskByIdController);
router.post("/tasks", createTaskController);
router.put("/tasks/:id", updateTaskController);
router.delete("/tasks/:id", deleteTaskController);
router.patch("/tasks/:id/status", updateTaskStatusController);

export default router;
