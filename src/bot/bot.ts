import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { setupCommands } from "./commands";
import { setupHandlers } from "./handlers";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

setupCommands(bot);
setupHandlers(bot);

bot.on("message", (ctx) => {
  console.log("Odebrano wiadomość:", ctx.message);
});

bot.command("add", (ctx) => {
  console.log("📩 Otrzymano komendę /add");
});
export default bot;
