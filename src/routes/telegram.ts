import { Router, Request, Response } from "express";
import bot from "@/bot/bot";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

export default router;
