import { QueryResult, PoolClient } from "pg";
import pool from "@/db";
import { Area } from "@/models/area";
import { AppDataSource } from "@/config/data-source";
import { AreaEntity } from "@/entities/area";

const areaRepository = AppDataSource.getRepository(AreaEntity);

export const getAllAreasService = async (): Promise<AreaEntity[]> => {
  try {
    return await areaRepository.find();
  } catch (error: unknown) {
    throw new Error("Failed to fetch areas.");
  }
};

export const getAreaByIdService = async (
  id: number,
): Promise<AreaEntity | null> => {
  try {
    return await areaRepository.findOneBy({ id });
  } catch (error: unknown) {
    throw new Error("Failed to fetch area by ID.");
  }
};

export const createAreaService = async (
  name: string,
  description?: string,
  imageUrl?: string,
  hex?: string,
): Promise<AreaEntity> => {
  try {
    const area = areaRepository.create({ name, description, imageUrl, hex });
    return await areaRepository.save(area);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ("code" in error && (error as any).code === "23505") {
        throw new Error("Area with this name already exists.");
      }
      throw new Error(`Database error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while creating the area.");
  }
};

export const updateAreaService = async (
  id: number,
  name: string,
  description?: string,
  imageUrl?: string,
  hex?: string,
): Promise<AreaEntity> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const area = await queryRunner.manager.findOneBy(AreaEntity, { id });

    if (!area) {
      throw new Error("Area not found.");
    }

    area.name = name;
    area.description = description;
    area.imageUrl = imageUrl;
    area.hex = hex;

    const updatedArea = await queryRunner.manager.save(area);
    await queryRunner.commitTransaction();

    return updatedArea;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error("Failed to update area.");
  } finally {
    await queryRunner.release();
  }
};

export const deleteArea = async (id: number): Promise<void> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM Areas WHERE id = $1", [id]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
