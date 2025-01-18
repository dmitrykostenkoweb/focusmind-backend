import { Request, Response } from "express";
import { handleDbError } from "@/utils";
import { RawTask } from "@/models/task";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "@/services/task";

export const getAllTasksController = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const rawTasks: RawTask[] = await getAllTasks();

    const tasks = rawTasks.map((rawTask: RawTask) => ({
      id: rawTask.id,
      name: rawTask.name,
      description: rawTask.description,
      status: rawTask.status,
      startDate: rawTask.start_date,
      endDate: rawTask.end_date,
      projectId: rawTask.project_id,
      areaId: rawTask.area_id,
      imageUrl: rawTask.image_url,
    }));

    res.json(tasks);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const getTaskByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const rawTask: RawTask = await getTaskById(Number(id));

    const task = {
      id: rawTask.id,
      name: rawTask.name,
      description: rawTask.description,
      status: rawTask.status,
      startDate: rawTask.start_date,
      endDate: rawTask.end_date,
      projectId: rawTask.project_id,
      areaId: rawTask.area_id,
      imageUrl: rawTask.image_url,
    };

    res.json(task);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const createTaskController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
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

    const rawTask: RawTask = await createTask(
      name,
      description,
      status,
      startDate,
      endDate,
      projectId,
      areaId,
      imageUrl,
    );

    const task = {
      id: rawTask.id,
      name: rawTask.name,
      description: rawTask.description,
      status: rawTask.status,
      startDate: rawTask.start_date,
      endDate: rawTask.end_date,
      projectId: rawTask.project_id,
      areaId: rawTask.area_id,
      imageUrl: rawTask.image_url,
    };

    res.json(task);
  } catch (err) {
    handleDbError(err, res);
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

    const rawTask: RawTask = await updateTask(
      Number(id),
      name,
      description,
      status,
      startDate,
      endDate,
      projectId,
      areaId,
      imageUrl,
    );

    const task = {
      id: rawTask.id,
      name: rawTask.name,
      description: rawTask.description,
      status: rawTask.status,
      startDate: rawTask.start_date,
      endDate: rawTask.end_date,
      projectId: rawTask.project_id,
      areaId: rawTask.area_id,
      imageUrl: rawTask.image_url,
    };

    res.json(task);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const deleteTaskController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    await deleteTask(Number(id));
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    handleDbError(err, res);
  }
};
