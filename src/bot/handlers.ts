import { Telegraf, Context } from "telegraf";
import { createTaskService } from "@/services/task";
import { Status } from "@/models/shared";

interface TaskState {
  step:
    | "waiting_for_title"
    | "waiting_for_description"
    | "waiting_for_projectId"
    | null;
  title?: string;
  description?: string;
}

const taskStates = new Map<number, TaskState>();

export function setupHandlers(bot: Telegraf): void {
  bot.hears("/start", async (ctx: Context): Promise<void> => {
    await ctx.reply("👋 Cześć! Jestem Twoim botem do zadań.");
    await ctx.reply(`
📌 Dostępne komendy:
➤ /add - Dodaj zadanie
`);
  });

  bot.hears("/add", async (ctx: Context): Promise<void> => {
    taskStates.set(ctx.from!.id, { step: "waiting_for_title" });
    await ctx.reply("📌 Podaj tytuł zadania:");
  });

  bot.on("text", async (ctx) => {
    const userId: number = ctx.from.id;
    const userState = taskStates.get(userId);

    if (!userState || !userState.step) return;

    if (userState.step === "waiting_for_title") {
      userState.title = ctx.message.text;
      userState.step = "waiting_for_description";
      await ctx.reply("📄 Podaj opis zadania:");
    } else if (userState.step === "waiting_for_description") {
      userState.description = ctx.message.text;
      userState.step = "waiting_for_projectId";
      await ctx.reply("📌 Podaj ID projektu:");
    } else if (userState.step === "waiting_for_projectId") {
      const projectId = Number(ctx.message.text);
      if (isNaN(projectId)) {
        return await ctx.reply("❌ Błąd! ID projektu musi być liczbą.");
      }

      try {
        const task = await createTaskService(
          userState.title!,
          projectId,
          Status.Inbox,
          userState.description!,
        );
        await ctx.reply(`✅ Zadanie dodane: ${task.name} (ID: ${task.id})`);
      } catch (error) {
        console.error("❌ Błąd:", error);
        await ctx.reply("❌ Nie udało się dodać zadania.");
      }

      taskStates.delete(userId);
    }
  });
}
