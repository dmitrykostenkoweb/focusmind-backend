import { QueryResult, PoolClient } from "pg";
import pool from "@/db";
import { RawArea } from "@/models/area";
import { AppDataSource } from "@/config/data-source";
import { Area } from "@/entities/area";

const areaRepository = AppDataSource.getRepository(Area);

export const getAllAreas = async (): Promise<RawArea[]> => {
  const result: QueryResult<RawArea> = await pool.query("SELECT * FROM Areas");
  return result.rows;
};

export const getAreaById = async (id: number): Promise<RawArea> => {
  const result: QueryResult<RawArea> = await pool.query(
    "SELECT * FROM Areas WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

export const createArea = async (
  name: string,
  description?: string,
  imageUrl?: string,
  hex?: string,
): Promise<RawArea> => {
  const area = areaRepository.create({ name, description, imageUrl, hex });
  return await areaRepository.save(area);
};

export const updateArea = async (
  id: number,
  name: string,
  description?: string,
  imageUrl?: string,
  hex?: string,
): Promise<RawArea> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<RawArea> = await client.query(
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
