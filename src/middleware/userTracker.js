
const db = require("../database");

module.exports = async (ctx, next) => {
    const user = ctx.from;
    const chat = ctx.chat;

    // Ignore updates without a user and bot accounts.
    if (!user || user.is_bot) {
        return next();
    }

    try {
        await db.updateJSON("users.json", (users) => {
            const userId = String(user.id);
            const now = new Date().toISOString();

            const existing = users[userId] || {};

            const chats = existing.chats || {};

            // Remember the chat where this interaction happened.
            if (chat) {
                const chatId = String(chat.id);

                chats[chatId] = {
                    type: chat.type,
                    title: chat.title || null,
                    lastSeen: now
                };
            }

            users[userId] = {
                ...existing,

                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name || null,
                username: user.username || null,

                firstSeen: existing.firstSeen || now,
                lastSeen: now,

                interactions:
                    (existing.interactions || 0) + 1,

                chats
            };

            return users;
        });

    } catch (error) {
        console.error("User tracking error:", error);
    }

    await next();
};

