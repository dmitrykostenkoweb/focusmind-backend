import { Request, Response } from "express";
import {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
} from "@/services/area";
import { Area } from "@/models/area";

export const getAllAreasController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const areas: Area[] = await getAllAreas();
    res.json(areas);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const getAreaByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const area: Area = await getAreaById(Number(id));
    res.json(area);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const createAreaController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, description, imageUrl } = req.body;
  try {
    const newArea: Area = await createArea(name, description, imageUrl);
    res.json(newArea);
  } catch (err) {
    handleDbError(err, res);
  }
};

export const updateAreaController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { name, description, imageUrl } = req.body;
  try {
    const updatedArea: Area = await updateArea(
      Number(id),
      name,
      description,
      imageUrl,
    );
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

const handleDbError = (err: unknown, res: Response): void => {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).send("Server error");
  } else {
    console.error("Unexpected error", err);
    res.status(500).send("Unexpected server error");
  }
};
