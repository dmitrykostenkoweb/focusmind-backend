import { Repository } from "typeorm";
import { AppDataSource } from "@/config/data-source";
import { ProjectEntity } from "@/entities/project";
import { AreaEntity } from "@/entities/area";
import { Status } from "@/models/shared";

const projectRepository: Repository<ProjectEntity> =
  AppDataSource.getRepository(ProjectEntity);

export const getAllProjectsService = async (): Promise<ProjectEntity[]> => {
  try {
    return await projectRepository.find({
      select: ["id", "name", "status", "areaId", "description", "imageUrl", "area"],
    });
  } catch (error) {
    throw new Error("Failed to fetch projects.");
  }
};

export const getProjectByIdService = async (
  id: number,
): Promise<ProjectEntity | null> => {
  try {
    return await projectRepository.findOneBy({ id });
  } catch (error) {
    throw new Error("Failed to fetch project by ID.");
  }
};

export const createProjectService = async (
  name: string,
  areaId: number,
  status: Status,
  description?: string,
  imageUrl?: string,
): Promise<ProjectEntity> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const area = await queryRunner.manager.findOneBy(AreaEntity, {
      id: areaId,
    });

    if (!area) {
      throw new Error("Area not found.");
    }

    const project = queryRunner.manager.create(ProjectEntity, {
      name,
      areaId,
      status,
      description,
      imageUrl,
    });

    const savedProject = await queryRunner.manager.save(project);
    await queryRunner.commitTransaction();
    return savedProject;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to create project.");
  } finally {
    await queryRunner.release();
  }
};

export const updateProjectService = async (
  id: number,
  name: string,
  areaId: number,
  status: Status,
  description?: string,
  imageUrl?: string,
): Promise<ProjectEntity> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const project = await queryRunner.manager.findOneBy(ProjectEntity, { id });

    if (!project) {
      throw new Error("Project not found.");
    }

    project.name = name;
    project.areaId = areaId;
    project.status = status;
    project.description = description;
    project.imageUrl = imageUrl;

    const updatedProject = await queryRunner.manager.save(project);
    await queryRunner.commitTransaction();
    return updatedProject;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to update project.");
  } finally {
    await queryRunner.release();
  }
};

export const deleteProjectService = async (id: number): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const project = await queryRunner.manager.findOneBy(ProjectEntity, { id });

    if (!project) {
      throw new Error("Project not found.");
    }

    await queryRunner.manager.remove(project);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to delete project.");
  } finally {
    await queryRunner.release();
  }
};
