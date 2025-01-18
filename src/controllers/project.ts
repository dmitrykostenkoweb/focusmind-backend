import { Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "@/services/project";
import { Project, RawProject } from "@/models/project";
import { handleDbError } from "@/utils";

export const getAllProjectsController = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const rawProjects: RawProject[] = await getAllProjects();

    const projects: Project[] = rawProjects.map((rawProject: RawProject) => ({
      id: rawProject.id,
      name: rawProject.name,
      areaId: rawProject.area_id,
      status: rawProject.status,
      description: rawProject.description,
      imageUrl: rawProject.image_url,
    }));

    res.json(projects);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const getProjectByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const rawProject: RawProject = await getProjectById(Number(id));

    const project: Project = {
      id: rawProject.id,
      name: rawProject.name,
      areaId: rawProject.area_id,
      status: rawProject.status,
      description: rawProject.description,
      imageUrl: rawProject.image_url,
    };

    res.json(project);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const createProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, areaId, description, imageUrl, status } = req.body;
    const newRawProject: RawProject = await createProject(
      name,
      areaId,
      status,
      description,
      imageUrl,
    );
    const newProject: Project = {
      id: newRawProject.id,
      name: newRawProject.name,
      areaId: newRawProject.area_id,
      status: newRawProject.status,
      description: newRawProject.description,
      imageUrl: newRawProject.image_url,
    };

    res.json(newProject);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, areaId, description, imageUrl, status } = req.body;
    const updatedRawProject: RawProject = await updateProject(
      Number(id),
      name,
      areaId,
      status,
      description,
      imageUrl,
    );

    const updatedProject: Project = {
      id: updatedRawProject.id,
      name: updatedRawProject.name,
      areaId: updatedRawProject.area_id,
      status: updatedRawProject.status,
      description: updatedRawProject.description,
      imageUrl: updatedRawProject.image_url,
    };

    res.json(updatedProject);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteProject(Number(id));
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    handleDbError(err, res);
  }
};
