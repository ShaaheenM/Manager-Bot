const db = require("../database");
const isAdmin = require("../utils/isAdmin");

function containsLink(message) {
    const text = message.text || message.caption || "";

    const entities = [
        ...(message.entities || []),
        ...(message.caption_entities || [])
    ];

    // Detect visible URLs and common domain formats.
    const urlPattern =
        /(?:https?:\/\/|www\.|t\.me\/|telegram\.me\/)[^\s]+|\b[a-z0-9-]+\.(?:com|net|org|io|ir|co|me|info|biz)(?:\/[^\s]*)?/i;

    // Detect hidden clickable links.
    const hasHiddenLink = entities.some(entity =>
        entity.type === "url" ||
        entity.type === "text_link"
    );

    return hasHiddenLink || urlPattern.test(text);
}

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

    let blocked = false;

    try {
        const groups = await db.readJSON("groups.json");
        const chatId = String(ctx.chat.id);

        if (groups[chatId]?.antiLink !== true) {
            return next();
        }

        // Administrators can share links.
        if (await isAdmin(ctx, ctx.from.id)) {
            return next();
        }

        if (containsLink(ctx.message)) {
            blocked = true;
        }

    } catch (error) {
        console.error("Anti-link detection error:", error);
    }

    if (!blocked) {
        return next();
    }

    try {
        await ctx.api.deleteMessage(
            ctx.chat.id,
            ctx.message.message_id
        );

        console.log(
            `Link deleted from user ${ctx.from.id}`
        );

    } catch (error) {
        console.error("Could not delete link:", error);
    }
};
