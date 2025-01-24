import { Telegraf, Context } from "telegraf";

export function setupCommands(bot: Telegraf) {
  bot.start((ctx: Context) =>
    ctx.reply("👋 Cześć! Jestem Twoim botem do zadań."),
  );
  bot.help((ctx: Context) =>
    ctx.reply(
      "📌 Dostępne komendy:\n" +
        "/add [nazwa zadania] - Dodaj zadanie\n" +
        "/list - Wyświetl listę zadań\n" +
        "/done [ID] - Oznacz zadanie jako ukończone\n" +
        "/delete [ID] - Usuń zadanie",
    ),
  );
}
