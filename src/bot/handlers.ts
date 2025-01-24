import { Telegraf, Context } from "telegraf";
import {
  createTaskService,
  getAllTasksService,
  // completeTaskService,
  deleteTaskService,
} from "@/services/task";
import { Status } from "@/models/shared";

export function setupHandlers(bot: Telegraf) {
  bot.command("add", async (ctx: Context) => {
    if (!ctx.message || !("text" in ctx.message)) {
      return ctx.reply("❌ Musisz podać treść zadania!");
    }

    const taskDetails = ctx.message.text.replace("/add", "").trim();
    if (!taskDetails) return ctx.reply("❌ Podaj treść zadania!");

    try {
      const task = await createTaskService(taskDetails, 1, 1, Status.Inbox);
      await ctx.reply(`✅ Zadanie dodane: ${task.name} (ID: ${task.id})`);
    } catch (error) {
      console.error("❌ Błąd:", error);
      await ctx.reply("❌ Nie udało się dodać zadania.");
    }
  });

  // bot.command("list", async (ctx: Context) => {
  //   try {
  //     const tasks = await getAllTasksService();
  //     if (!tasks.length) return ctx.reply("📭 Brak zadań.");
  //
  //     const taskList = tasks
  //       .map((t, i) => `${i + 1}. ${t.name} [ID: ${t.id}] - ${t.status}`)
  //       .join("\n");
  //     ctx.reply(`📋 Lista zadań:\n${taskList}`);
  //   } catch (error) {
  //     console.error("❌ Błąd:", error);
  //     ctx.reply("❌ Nie udało się pobrać listy zadań.");
  //   }
  // });
  //
  // bot.command("done", async (ctx: Context) => {
  //   const taskId = ctx.message.text.replace("/done", "").trim();
  //   if (!taskId || isNaN(Number(taskId)))
  //     return ctx.reply("❌ Podaj poprawne ID zadania!");
  //
  //   try {
  //     await completeTaskService(Number(taskId));
  //     ctx.reply(`✅ Zadanie ${taskId} oznaczone jako ukończone.`);
  //   } catch (error) {
  //     console.error("❌ Błąd:", error);
  //     ctx.reply("❌ Nie udało się oznaczyć zadania jako ukończone.");
  //   }
  // });
  //
  // bot.command("delete", async (ctx: Context) => {
  //   const taskId = ctx.message.text.replace("/delete", "").trim();
  //   if (!taskId || isNaN(Number(taskId)))
  //     return ctx.reply("❌ Podaj poprawne ID zadania!");
  //
  //   try {
  //     await deleteTaskService(Number(taskId));
  //     ctx.reply(`🗑️ Zadanie ${taskId} zostało usunięte.`);
  //   } catch (error) {
  //     console.error("❌ Błąd:", error);
  //     ctx.reply("❌ Nie udało się usunąć zadania.");
  //   }
  // });
}
