const db = require("../database");
const adminOnly = require("../middleware/adminOnly");

module.exports = (bot) => {
    bot.command("antilink", adminOnly, async (ctx) => {
        const chatId = String(ctx.chat.id);
        const option = ctx.match.trim().toLowerCase();

        try {
            if (!option) {
                const groups = await db.readJSON("groups.json");

                const enabled =
                    groups[chatId]?.antiLink === true;

                return ctx.reply(
                    `Anti-link is ${enabled ? "ON" : "OFF"}.\n\n` +
                    "Usage:\n" +
                    "/antilink on\n" +
                    "/antilink off"
                );
            }

            if (!["on", "off"].includes(option)) {
                return ctx.reply(
                    "Usage:\n/antilink on\n/antilink off"
                );
            }

            await db.updateJSON("groups.json", (data) => {
                if (!data[chatId]) {
                    data[chatId] = {};
                }

                data[chatId].antiLink = option === "on";

                return data;
            });

            await ctx.reply(
                `Anti-link is now ${option.toUpperCase()}!`
            );

        } catch (error) {
            console.error("Anti-link command error:", error);

            await ctx.reply(
                "Could not update anti-link settings."
            );
        }
    });
};
