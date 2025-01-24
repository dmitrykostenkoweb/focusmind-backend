import { Request, Response } from "express";
import {
  getAllAreasService,
  getAreaByIdService,
  createAreaService,
  updateAreaService,
  deleteArea,
} from "@/services/area";
import { Area } from "@/models/area";
import { handleDbError } from "@/utils";

export const getAllAreasController = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const areas = await getAllAreasService();
    res.json(areas);
  } catch (error: unknown) {
    let errorMessage = "Internal server error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export const getAreaByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const area = await getAreaByIdService(Number(id));

    if (!area) {
      res.status(404).json({ error: "Area not found." });
      return;
    }

    res.json(area);
  } catch (error: unknown) {
    let errorMessage = "Internal server error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export const createAreaController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, description, imageUrl, hex } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required." });
    return;
  }
  try {
    const newArea = await createAreaService(name, description, imageUrl, hex);
    res.status(201).json(newArea);
  } catch (error: unknown) {
    let errorMessage = "Internal server error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export const updateAreaController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { name, description, imageUrl, hex } = req.body;

  try {
    if (!name) {
      res.status(400).json({ error: "Name is required." });
      return;
    }

    const updatedArea = await updateAreaService(
      Number(id),
      name,
      description,
      imageUrl,
      hex,
    );
    res.json(updatedArea);
  } catch (error: unknown) {
    let errorMessage = "Internal server error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export const deleteAreaController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    await deleteArea(Number(id));
    res.json({ message: "Area deleted successfully" });
  } catch (err) {
    handleDbError(err, res);
  }
};
