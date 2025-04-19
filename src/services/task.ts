import { AppDataSource } from "@/config/data-source";
import { TaskEntity } from "@/entities/task";
import { Repository } from "typeorm";
import { Status } from "@/models/shared";
import { ProjectEntity } from "@/entities/project";

const taskRepository: Repository<TaskEntity> =
  AppDataSource.getRepository(TaskEntity);

export const getAllTasksService = async (statuses?: Status[]): Promise<TaskEntity[]> => {
  try {
    const queryBuilder = taskRepository.createQueryBuilder("task");
    
    if (statuses && statuses.length > 0) {
      queryBuilder.where("task.status IN (:...statuses)", { statuses });
    }

    return await queryBuilder
      .select([
        "task.id",
        "task.entityType",
        "task.name",
        "task.description",
        "task.status",
        "task.startDate",
        "task.endDate",
        "task.projectId",
        "task.imageUrl",
      ])
      .getMany();
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

    if (!project) {
      throw new Error("Project not found.");
    }
    const entityType = "task";
    const task = queryRunner.manager.create(TaskEntity, {
      name,
      projectId,
      status,
      description,
      startDate,
      endDate,
      imageUrl,
      entityType,
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

export const updateTaskStatusService = async (
  id: number,
  status: Status,
): Promise<TaskEntity> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const task = await queryRunner.manager.findOneBy(TaskEntity, { id });

    if (!task) {
      throw new Error("Task not found.");
    }

    task.status = status;

    const updatedTask = await queryRunner.manager.save(task);
    await queryRunner.commitTransaction();
    return updatedTask;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to update task status.");
  } finally {
    await queryRunner.release();
  }
};
