import axios from "axios";
import dotenv from "dotenv";
import startNgrok from "./ngrok";

dotenv.config();

const TELEGRAM_BOT_TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || "";

async function setTelegramWebhook(): Promise<void> {
  const ngrokUrl: string | null = await startNgrok();
  if (!ngrokUrl) {
    console.error("❌Unable to set webhook, no URL ngrok.");
    return;
  }

  const webhookUrl: string = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${ngrokUrl}`;

  try {
    await axios.get(webhookUrl);
    console.log(`✅ Telegram webhook set to: ${ngrokUrl}`);
  } catch (error) {
    console.error("❌ Error setting Telegram webhook:", error);
  }
}

export default setTelegramWebhook;
