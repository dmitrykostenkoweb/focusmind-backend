import { AppDataSource } from "@/config/data-source";
import { TaskEntity } from "@/entities/task";
import { Repository } from "typeorm";
import { Status } from "@/models/shared";
import { ProjectEntity } from "@/entities/project";
import { AreaEntity } from "@/entities/area";

const taskRepository: Repository<TaskEntity> =
  AppDataSource.getRepository(TaskEntity);

export const getAllTasksService = async (): Promise<TaskEntity[]> => {
  try {
    return await taskRepository.find({
      select: [
        "id",
        "name",
        "description",
        "status",
        "startDate",
        "endDate",
        "projectId",
        "areaId",
        "imageUrl",
      ],
    });
  } catch (error) {
    throw new Error("Failed to fetch tasks.");
  }
};

export const getTaskByIdService = async (
  id: number,
): Promise<TaskEntity | null> => {
  try {
    return await taskRepository.findOneBy({ id });
  } catch (error) {
    throw new Error("Failed to fetch task by ID.");
  }
};

export const createTaskService = async (
  name: string,
  projectId: number,
  areaId: number,
  status: Status = Status.Inbox,
  description?: string,
  startDate?: Date,
  endDate?: Date,
  imageUrl?: string,
): Promise<TaskEntity> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const project = await queryRunner.manager.findOneBy(ProjectEntity, {
      id: projectId,
    });
    const area = await queryRunner.manager.findOneBy(AreaEntity, {
      id: areaId,
    });

    if (!project || !area) {
      throw new Error("Project or Area not found.");
    }

    const task = queryRunner.manager.create(TaskEntity, {
      name,
      projectId,
      areaId,
      status,
      description,
      startDate,
      endDate,
      imageUrl,
    });

    const savedTask = await queryRunner.manager.save(task);
    await queryRunner.commitTransaction();
    return savedTask;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to create task.");
  } finally {
    await queryRunner.release();
  }
};

export const updateTaskService = async (
  id: number,
  name: string,
  projectId: number,
  areaId: number,
  status?: Status,
  description?: string,
  startDate?: Date,
  endDate?: Date,
  imageUrl?: string,
): Promise<TaskEntity> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const task = await queryRunner.manager.findOneBy(TaskEntity, { id });

    if (!task) {
      throw new Error("Task not found.");
    }

    task.name = name;
    task.projectId = projectId;
    task.areaId = areaId;
    task.status = status || task.status;
    task.description = description;
    task.startDate = startDate;
    task.endDate = endDate;
    task.imageUrl = imageUrl;

    const updatedTask = await queryRunner.manager.save(task);
    await queryRunner.commitTransaction();
    return updatedTask;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to update task.");
  } finally {
    await queryRunner.release();
  }
};

export const deleteTaskService = async (id: number): Promise<boolean> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const task = await queryRunner.manager.findOneBy(TaskEntity, { id });

    if (!task) {
      await queryRunner.rollbackTransaction();
      return false;
    }

    await queryRunner.manager.remove(task);
    await queryRunner.commitTransaction();
    return true;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to delete task.");
  } finally {
    await queryRunner.release();
  }
};
//todo completeTask service
