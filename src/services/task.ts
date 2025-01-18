import { QueryResult, PoolClient } from "pg";
import pool from "@/db";
import { Status } from "@/models/shared";
import { RawTask } from "@/models/task";

export const getAllTasks = async (): Promise<RawTask[]> => {
  const result: QueryResult<RawTask> = await pool.query("SELECT * FROM Tasks");
  return result.rows;
};

export const getTaskById = async (id: number): Promise<RawTask> => {
  const result: QueryResult<RawTask> = await pool.query(
    "SELECT * FROM Tasks WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

export const createTask = async (
  name: string,
  description?: string,
  status?: Status,
  start_date?: string,
  end_date?: string,
  project_id?: number,
  area_id?: number,
  image_url?: string,
): Promise<RawTask> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<RawTask> = await client.query(
      "INSERT INTO Tasks (name, description, status, start_date, end_date, project_id, area_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        name,
        description,
        status,
        start_date,
        end_date,
        project_id,
        area_id,
        image_url,
      ],
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Failed to create task");
  } finally {
    client.release();
  }
};

export const updateTask = async (
  id: number,
  name: string,
  description?: string,
  status?: Status,
  start_date?: string,
  end_date?: string,
  project_id?: number,
  area_id?: number,
  image_url?: string,
): Promise<RawTask> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<RawTask> = await client.query(
      "UPDATE Tasks SET name = $1, description = $2, status = $3, start_date = $4, end_date = $5, project_id = $6, area_id = $7, image_url = $8 WHERE ID = $9 RETURNING *",
      [
        name,
        description,
        status,
        start_date,
        end_date,
        project_id,
        area_id,
        image_url,
        id,
      ],
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Failed to update task");
  } finally {
    client.release();
  }
};

export const deleteTask = async (id: number): Promise<RawTask> => {
  const client: PoolClient = await pool.connect();
  try {
    await client.query("BEGIN");
    const result: QueryResult<RawTask> = await client.query(
      "DELETE FROM Tasks WHERE ID = $1 RETURNING *",
      [id],
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error("Failed to delete task");
  } finally {
    client.release();
  }
};
