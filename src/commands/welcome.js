
const db = require("../database");
const adminOnly = require("../middleware/adminOnly");

module.exports = (bot) => {

    bot.command("welcome", adminOnly, async (ctx) => {

        const chatId = String(ctx.chat.id);
        const option = ctx.match.trim().toLowerCase();

        try {

            // Show current status.
            if (!option) {
                const groups = await db.readJSON("groups.json");

                const enabled =
                    groups[chatId]?.welcome !== false;

                return ctx.reply(
                    `Welcome messages: ${enabled ? "ON" : "OFF"}\n\n` +
                    "Usage:\n/welcome on\n/welcome off"
                );
            }

            // Validate input.
            if (!["on", "off"].includes(option)) {
                return ctx.reply(
                    "Invalid option!\nUse /welcome on or /welcome off."
                );
            }

            // Save the new setting.
            await db.updateJSON("groups.json", (data) => {

                if (!data[chatId]) {
                    data[chatId] = {};
                }

                data[chatId].welcome = option === "on";

                return data;
            });

            await ctx.reply(
                `Welcome messages are now ${option.toUpperCase()}!`
            );

        } catch (error) {

            console.error("Welcome command error:", error);

            await ctx.reply(
                "Something went wrong while updating settings."
            );

        }

    });

};

