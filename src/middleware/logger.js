const appLogger = require("../utils/logger");

module.exports = async (ctx, next) => {
    const updateId = ctx.update.update_id;
    const userId = ctx.from?.id || "unknown";
    const chatId = ctx.chat?.id || "private";

    appLogger.info(
        `Update ${updateId} | User: ${userId} | Chat: ${chatId}`
    );

    try {
        await next();
    } catch (error) {
        appLogger.error(
            `Update ${updateId} failed`,
            error
        );

        // Let grammY's global error handler handle it.
        throw error;
    }
};
