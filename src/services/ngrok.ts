import axios from "axios";
import dotenv from "dotenv";
import ngrok from "ngrok";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const NGROK_HOSTNAME = process.env.NGROK_HOSTNAME || "http://ngrok:4040";

export async function startNgrok() {
  try {
    const url = await ngrok.connect({
      proto: "http",
      addr: 3000,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    console.log(`Ngrok launched at: ${url}`);
    return url;
  } catch (error) {
    console.error("Error launching ngrok:", error);
    return null;
  }
}

async function getNgrokUrl() {
  try {
    const response = await axios.get(`${NGROK_HOSTNAME}/api/tunnels`);
    const ngrokUrl = response.data.tunnels[0].public_url;
    console.log(`Ngrok URL: ${ngrokUrl}`);
    return ngrokUrl;
  } catch (error) {
    console.error("Error downloading URL ngrok:", error);
    return null;
  }
}

export async function setTelegramWebhook() {
  const ngrokUrl = await getNgrokUrl();
  if (!ngrokUrl) {
    console.error("Unable to set webhook, no URL ngrok.");
    return;
  }

  const webhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${ngrokUrl}`;
  try {
    await axios.get(webhookUrl);
    console.log(`✅ Telegram webhook set to: ${ngrokUrl}`);
  } catch (error) {
    console.error("❌ Error setting Telegram webhook:", error);
  }
}
