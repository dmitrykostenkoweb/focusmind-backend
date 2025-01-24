import { Request, Response } from "express";
import {
  createArea,
  deleteArea,
  getAllAreasService,
  getAreaById,
  updateArea,
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
    const rawArea: Area = await getAreaById(Number(id));

    const area: Area = {
      id: rawArea.id,
      name: rawArea.name,
      description: rawArea.description,
      imageUrl: rawArea.imageUrl,
      hex: rawArea.hex,
    };

    res.json(area);
  } catch (err) {
    handleDbError(err, res);
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
    const newArea = await createArea(name, description, imageUrl, hex);
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
    const updatedArea: Area = await updateArea(
      Number(id),
      name,
      description,
      imageUrl,
      hex,
    );

    // const updatedArea: Area = {
    //   id: updatedArea.id,
    //   name: updatedArea.name,
    //   description: updatedArea.description,
    //   imageUrl: updatedArea.imageUrl,
    //   hex: updatedArea.hex,
    // };

    res.json(updatedArea);
  } catch (err) {
    handleDbError(err, res);
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
