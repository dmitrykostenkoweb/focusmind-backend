import "module-alias/register";
import express from "express";
import { Express } from "express";

import cors from "cors";
import dotenv from "dotenv";
//ROUTES
import area from "./routes/area";
import project from "./routes/project";
import task from "./routes/task";
import telegram from "./routes/telegram";
//bot
import bot from "./bot/bot";
//services
import setTelegramWebhook from "@/services/telegram";

dotenv.config();

const app: Express = express();
const PORT: string = process.env.APP_PORT || "3000";

app.use(cors());
app.use(express.json());
app.use(area);
app.use(project);
app.use(task);
app.use(telegram);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await setTelegramWebhook();
  await bot.launch();
});
