import { Response } from "express";

export const handleDbError = (err: unknown, res: Response): void => {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).send("Server error");
  } else {
    console.error("Unexpected error", err);
    res.status(500).send("Unexpected server error");
  }
};
