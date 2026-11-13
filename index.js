require("dotenv").config();

const { Bot } = require("grammy");

const registerCommands = require("./src/commands");

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN is missing from .env");
}

const bot = new Bot(token);

// Register commands
registerCommands(bot);

// Handle errors
bot.catch((err) => {
    console.error("Bot error:", err.error);
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

// Start long polling
bot.start({
    onStart: (botInfo) => {
        console.log(`Bot @${botInfo.username} is running!`);
    }
});
