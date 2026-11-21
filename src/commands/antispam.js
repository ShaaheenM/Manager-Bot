
const db = require("../database");
const adminOnly = require("../middleware/adminOnly");

module.exports = (bot) => {

    bot.command("antispam", adminOnly, async (ctx) => {

        const chatId = String(ctx.chat.id);

        const option = ctx.match.trim().toLowerCase();

        try {

            // Show current status.
            if (!option) {

                const groups = await db.readJSON("groups.json");

                const enabled =
                    groups[chatId]?.antiSpam === true;

                return ctx.reply(
                    `Anti-spam: ${enabled ? "ON" : "OFF"}\n\n` +
                    "Usage:\n" +
                    "/antispam on\n" +
                    "/antispam off"
                );
            }

            // Validate argument.
            if (!["on", "off"].includes(option)) {

                return ctx.reply(
                    "Usage:\n/antispam on\n/antispam off"
                );

            }

            // Update JSON settings.
            await db.updateJSON("groups.json", (data) => {

                if (!data[chatId]) {
                    data[chatId] = {};
                }

                data[chatId].antiSpam = option === "on";

                return data;

            });

            await ctx.reply(
                `Anti-spam is now ${option.toUpperCase()}!`
            );

        } catch (error) {

            console.error("Anti-spam command error:", error);

            await ctx.reply(
                "Could not update anti-spam settings."
            );

        }

    });

};

