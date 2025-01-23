import { Request, Response } from "express";
import {
  createArea,
  deleteArea,
  getAllAreas,
  getAreaById,
  updateArea,
} from "@/services/area";
import { Area, RawArea } from "@/models/area";
import { handleDbError } from "@/utils";

export const getAllAreasController = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    const rawAreas: RawArea[] = await getAllAreas();

    const areas: Area[] = rawAreas.map((rawArea: RawArea) => ({
      id: rawArea.id,
      name: rawArea.name,
      description: rawArea.description,
      imageUrl: rawArea.image_url,
      hex: rawArea.hex,
    }));

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
    const rawArea: RawArea = await getAreaById(Number(id));

    const area: Area = {
      id: rawArea.id,
      name: rawArea.name,
      description: rawArea.description,
      imageUrl: rawArea.image_url,
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
  try {
    const newRawArea: RawArea = await createArea(
      name,
      description,
      imageUrl,
      hex,
    );

    const newArea: Area = {
      id: newRawArea.id,
      name: newRawArea.name,
      description: newRawArea.description,
      imageUrl: newRawArea.image_url,
      hex: newRawArea.hex,
    };

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
  const { name, description, imageUrl, hex } = req.body;
  try {
    const updatedRawArea: RawArea = await updateArea(
      Number(id),
      name,
      description,
      imageUrl,
      hex,
    );

    const updatedArea: Area = {
      id: updatedRawArea.id,
      name: updatedRawArea.name,
      description: updatedRawArea.description,
      imageUrl: updatedRawArea.image_url,
      hex: updatedRawArea.hex,
    };

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
