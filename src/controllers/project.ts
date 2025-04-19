import { Request, Response } from "express";
import {
  getAllProjectsService,
  getProjectByIdService,
  createProjectService,
  updateProjectService,
  deleteProjectService,
  updateProjectStatusService,
} from "@/services/project";
import { Status } from "@/models/shared";

export const getAllProjectsController = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await getAllProjectsService();
    res.json(projects);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProjectByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await getProjectByIdService(Number(id));

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.json(project);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, areaId, status, description, imageUrl } = req.body;

    if (!name || !areaId || !status) {
      res.status(400).json({ error: "Name, areaId, and status are required." });
      return;
    }

    const newProject = await createProjectService(
      name,
      areaId,
      status,
      description,
      imageUrl,
    );
    res.status(201).json(newProject);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, areaId, status, description, imageUrl } = req.body;

    if (!name || !areaId || !status) {
      res.status(400).json({ error: "Name, areaId, and status are required." });
      return;
    }

    const updatedProject = await updateProjectService(
      Number(id),
      name,
      areaId,
      status,
      description,
      imageUrl,
    );
    res.json(updatedProject);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteProjectService(Number(id));
    res.json({ message: "Project deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProjectStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "Status is required." });
      return;
    }

    const updatedProject = await updateProjectStatusService(Number(id), status);

    if (!updatedProject) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.json(updatedProject);
  } catch (error: unknown) {
    res.status(500).json({ error: "Internal server error." });
  }
};
