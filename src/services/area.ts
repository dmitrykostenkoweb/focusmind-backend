import { QueryResult, PoolClient } from "pg";
import pool from "@/db";
import { Area } from "@/models/area";

export const getAllAreas = async (): Promise<Area[]> => {
  const result: QueryResult<Area> = await pool.query("SELECT * FROM Areas");
  return result.rows;
};

export const getAreaById = async (id: number): Promise<Area> => {
  const result: QueryResult<Area> = await pool.query(
    "SELECT * FROM Areas WHERE AreaID = $1",
    [id],
  );
  return result.rows[0];
};



export const createArea = async (
  name: string,
  description?: string,
  imageUrl?: string,
): Promise<Area> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<Area> = await client.query(
      "INSERT INTO Areas (Name, Description, ImageURL) VALUES ($1, $2, $3) RETURNING *",
      [name, description, imageUrl],
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Failed to create area");
  } finally {
    client.release();
  }
};

export const updateArea = async (
  id: number,
  name: string,
  description?: string,
  imageUrl?: string,
): Promise<Area> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<Area> = await client.query(
      "UPDATE Areas SET Name = $1, Description = $2, ImageURL = $3 WHERE AreaID = $4 RETURNING *",
      [name, description, imageUrl, id],
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
    await client.query("DELETE FROM Areas WHERE AreaID = $1", [id]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
