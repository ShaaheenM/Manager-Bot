const db = require("../database");
const isAdmin = require("../utils/isAdmin");

const lastMessages = new Map();

module.exports = async (ctx, next) => {
    if (
        !ctx.chat ||
        !["group", "supergroup"].includes(ctx.chat.type) ||
        !ctx.from ||
        ctx.from.is_bot ||
        !ctx.message
    ) {
        return next();
    }

    if (ctx.message.text?.startsWith("/")) {
        return next();
    }

    let blocked = false;
    const key = `${ctx.chat.id}:${ctx.from.id}`;

    try {
        const groups = await db.readJSON("groups.json");
        const settings = groups[String(ctx.chat.id)];

        if (settings?.slowMode === true) {
            const admin = await isAdmin(ctx, ctx.from.id);

            if (!admin) {
                const seconds = Number(
                    settings.slowModeSeconds || 10
                );

                const delay = seconds * 1000;
                const now = Date.now();
                const lastTime = lastMessages.get(key) || 0;

                if (now - lastTime < delay) {
                    blocked = true;
                } else {
                    lastMessages.set(key, now);
                }
            }
        }
    } catch (error) {
        console.error("Slow-mode detection error:", error);
    }

    if (!blocked) {
        return next();
    }

    try {
        await ctx.api.deleteMessage(
            ctx.chat.id,
            ctx.message.message_id
        );
    } catch (error) {
        console.error("Slow-mode deletion error:", error);
    }
};
