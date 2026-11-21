const db = require("../database");
const adminOnly = require("../middleware/adminOnly");

module.exports = (bot) => {
    bot.command("slowmode", adminOnly, async (ctx) => {
        const chatId = String(ctx.chat.id);
        const option = ctx.match.trim().toLowerCase();

        try {
            const groups = await db.readJSON("groups.json");
            const current = groups[chatId] || {};

            // Show current settings.
            if (!option) {
                const enabled = current.slowMode === true;
                const seconds = current.slowModeSeconds || 10;

                return ctx.reply(
                    "🐢 Slow Mode Settings\n\n" +
                    `Status: ${enabled ? "ON" : "OFF"}\n` +
                    `Delay: ${seconds} seconds\n\n` +
                    "Commands:\n" +
                    "/slowmode on\n" +
                    "/slowmode off\n" +
                    "/slowmode 10"
                );
            }

            // Enable slow mode.
            if (option === "on") {
                await db.updateJSON("groups.json", (data) => {
                    if (!data[chatId]) data[chatId] = {};

                    data[chatId].slowMode = true;

                    if (!data[chatId].slowModeSeconds) {
                        data[chatId].slowModeSeconds = 10;
                    }

                    return data;
                });

                return ctx.reply(
                    "✅ Slow mode enabled!"
                );
            }

            // Disable slow mode.
            if (option === "off") {
                await db.updateJSON("groups.json", (data) => {
                    if (!data[chatId]) data[chatId] = {};

                    data[chatId].slowMode = false;

                    return data;
                });

                return ctx.reply(
                    "❌ Slow mode disabled!"
                );
            }

            // Set the delay.
            const seconds = Number(option);

            if (
                !Number.isInteger(seconds) ||
                seconds < 2 ||
                seconds > 300
            ) {
                return ctx.reply(
                    "Choose a delay between 2 and 300 seconds."
                );
            }

            await db.updateJSON("groups.json", (data) => {
                if (!data[chatId]) data[chatId] = {};

                data[chatId].slowModeSeconds = seconds;
                data[chatId].slowMode = true;

                return data;
            });

            await ctx.reply(
                `✅ Slow mode enabled with a ${seconds}-second delay!`
            );

        } catch (error) {
            console.error("Slow-mode command error:", error);

            await ctx.reply(
                "Could not update slow-mode settings."
            );
        }
    });
};
