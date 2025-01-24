import axios from "axios";

async function startNgrok(): Promise<string | null> {
  try {
    const res = await axios.get("http://ngrok:4040/api/tunnels");

    if (res.data.tunnels.length === 0)
      throw new Error("Ngrok is running but no tunnels found.");

    const url: string = res.data.tunnels[0].public_url;
    console.log(`✅ Ngrok tunnel is active at: ${url}`);
    return url;
  } catch (error: any) {
    console.error("❌ Error retrieving ngrok URL:", error.message);
    return null;
  }
}

export default startNgrok;
