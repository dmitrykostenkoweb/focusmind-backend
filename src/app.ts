import "module-alias/register";
import express from "express";
import cors from "cors";
import { Express } from "express";
import dotenv from "dotenv";
import area from "./routes/area";
import project from "./routes/project";
import task from "./routes/task";
dotenv.config();

const app: Express = express();
const PORT: string = process.env.APP_PORT || "3000";

app.use(cors());
app.use(express.json());
app.use(area);
app.use(project);
app.use(task);

app.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
