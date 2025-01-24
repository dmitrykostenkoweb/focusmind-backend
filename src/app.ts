import "module-alias/register";
import express from "express";
import cors from "cors";
import { Express } from "express";
import dotenv from "dotenv";
import area from "./routes/area";
import project from "./routes/project";
import task from "./routes/task";
import telegram from "./routes/telegram";
import { setTelegramWebhook, startNgrok } from "@/services/ngrok";

dotenv.config();

const app: Express = express();
const PORT: string = process.env.APP_PORT || "3000";

app.use(cors());
app.use(express.json());
app.use(area);
app.use(project);
app.use(task);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await startNgrok();
  await setTelegramWebhook();
});
