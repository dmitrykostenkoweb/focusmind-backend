import { Request, Response } from "express";
import {
  getAllTasksService,
  getTaskByIdService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "@/services/task";

export const getAllTasksController = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await getAllTasksService();
    res.json(tasks);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getTaskByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await getTaskByIdService(Number(id));

    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.json(task);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createTaskController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      projectId,
      areaId,
      status,
      description,
      startDate,
      endDate,
      imageUrl,
    } = req.body;

    if (!name || !projectId || !areaId) {
      res
        .status(400)
        .json({ error: "Name, projectId, and areaId are required." });
      return;
    }

    const newTask = await createTaskService(
      name,
      projectId,
      areaId,
      status,
      description,
      startDate,
      endDate,
      imageUrl,
    );
    res.status(201).json(newTask);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateTaskController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      projectId,
      areaId,
      imageUrl,
    } = req.body;

    if (!name || !projectId || !areaId) {
      res
        .status(400)
        .json({ error: "Name, projectId, and areaId are required." });
      return;
    }

    const updatedTask = await updateTaskService(
      Number(id),
      name,
      projectId,
      areaId,
      status,
      description,
      startDate,
      endDate,
      imageUrl,
    );

    if (!updatedTask) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.json(updatedTask);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedTask = await deleteTaskService(Number(id));

    if (!deletedTask) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};
