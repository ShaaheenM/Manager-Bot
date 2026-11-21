const db = require("../database");
const isAdmin = require("../utils/isAdmin");

const userMessages = new Map();

const FLOOD_LIMIT = 6;
const FLOOD_WINDOW = 5000;

const REPEAT_LIMIT = 3;
const REPEAT_WINDOW = 10000;

module.exports = async (ctx, next) => {
    if (
        !ctx.chat ||
        !["group", "supergroup"].includes(ctx.chat.type) ||
        !ctx.from ||
        ctx.from.is_bot ||
        !ctx.message?.text
    ) {
        return next();
    }

    try {
        const groups = await db.readJSON("groups.json");
        const chatId = String(ctx.chat.id);

        if (groups[chatId]?.antiSpam !== true) {
            return next();
        }

        // Exempt group administrators.
        if (await isAdmin(ctx, ctx.from.id)) {
            return next();
        }

        const now = Date.now();
        const userId = String(ctx.from.id);
        const key = `${chatId}:${userId}`;

        const messageText = ctx.message.text.trim();

        if (!messageText) {
            return next();
        }

        let history = userMessages.get(key) || [];

        history = history.filter(item =>
            now - item.time <= REPEAT_WINDOW
        );

        history.push({
            text: messageText,
            time: now
        });

        userMessages.set(key, history);

        const recentMessages = history.filter(item =>
            now - item.time <= FLOOD_WINDOW
        );

        const repeatedMessages = history.filter(item =>
            item.text === messageText
        );

        const isFlooding =
            recentMessages.length >= FLOOD_LIMIT;

        const isRepeating =
            repeatedMessages.length >= REPEAT_LIMIT;

        if (isFlooding || isRepeating) {
            try {
                await ctx.api.deleteMessage(
                    ctx.chat.id,
                    ctx.message.message_id
                );
            } catch (error) {
                console.error("Spam deletion error:", error);
            }

            return;
        }

        await next();

    } catch (error) {
        console.error("Anti-spam middleware error:", error);
        await next();
    }
};
