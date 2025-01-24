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
    return await areaRepository.findOneBy({ id }); // TypeORM obsłuży zapytanie
  } catch (error: unknown) {
    throw new Error("Failed to fetch area by ID.");
  }
};

export const createArea = async (
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

export const updateArea = async (
  id: number,
  name: string,
  description?: string,
  imageUrl?: string,
  hex?: string,
): Promise<Area> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<Area> = await client.query(
      "UPDATE Areas SET name = $1, description = $2, image_url = $3, hex = $4 WHERE ID = $5 RETURNING *",
      [name, description, imageUrl, hex, id],
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
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
