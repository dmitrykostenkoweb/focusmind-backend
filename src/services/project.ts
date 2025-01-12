import { QueryResult, PoolClient } from "pg";
import pool from "@/db";
import { RawProject } from "@/models/project";

export const getAllProjects = async (): Promise<RawProject[]> => {
  const result: QueryResult<RawProject> = await pool.query(
    "SELECT * FROM Projects",
  );
  return result.rows;
};

export const getProjectById = async (id: number): Promise<RawProject> => {
  const result: QueryResult<RawProject> = await pool.query(
    "SELECT * FROM Projects WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

export const createProject = async (
  name: string,
  areaId: number,
  description?: string,
  imageUrl?: string,
): Promise<RawProject> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<RawProject> = await client.query(
      "INSERT INTO Projects (name, area_id, description, image_url) VALUES ($1, $2, $3) RETURNING *",
      [name, areaId, description, imageUrl],
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Failed to create project");
  } finally {
    client.release();
  }
};

export const updateProject = async (
  id: number,
  name: string,
  areaId: number,
  description?: string,
  imageUrl?: string,
): Promise<RawProject> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<RawProject> = await client.query(
      "UPDATE Projects SET name = $1, area_id = $2,  description = $3, image_url = $4 WHERE ID = $4 RETURNING *",
      [name, areaId, description, imageUrl, id],
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

export const deleteProject = async (id: number): Promise<void> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM Projects WHERE id = $1", [id]);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
