import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { setupHandlers } from "./handlers";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

setupHandlers(bot);

export default bot;
