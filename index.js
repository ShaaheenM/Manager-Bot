require("dotenv").config();

const { Bot } = require("grammy");

const logger = require("./src/middleware/logger");

const registerCommands = require("./src/commands");

const registerHandlers = require("./src/handlers");

const antiSpam = require("./src/middleware/antiSpam");

const antiLink = require("./src/middleware/antiLink");

const slowMode = require("./src/middleware/slowMode");

const appLogger = require("./src/utils/logger");

const userTracker = require("./src/middleware/userTracker");

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN is missing from .env");
}

const bot = new Bot(token);

bot.catch((err) => {
    const ctx = err.ctx;

    appLogger.error(
        `Unhandled update error. Update ID: ${ctx.update.update_id}`,
        err.error
    );
});

// Register middleware first.
bot.use(logger);

bot.use(userTracker)

// Anti-spam middleware.
bot.use(async (ctx, next) => {

    if (ctx.message?.text) {
        return antiSpam(ctx, next);
    }

    await next();

});

//anti-link
bot.use(antiLink);

//slowmode middleware
bot.use(slowMode);

// Register commands
registerCommands(bot);

// Register event handlers.
registerHandlers(bot);

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
        appLogger.info(
            `Bot @${botInfo.username} started successfully`
        );
    }
}).catch((error) => {
    appLogger.error("Bot failed to start", error);
    process.exitCode = 1;
});
