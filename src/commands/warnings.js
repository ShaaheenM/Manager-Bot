const warnings = require("../utils/warnings");

module.exports = (bot) => {
    bot.command("warnings", async (ctx) => {
        const target =
            ctx.message.reply_to_message?.from || ctx.from;

        try {
            const count = await warnings.getCount(
                ctx.chat.id,
                target.id
            );

            await ctx.reply(
                `📋 Warning information\n\n` +
                `Member: ${target.first_name}\n` +
                `Warnings: ${count}/3`
            );

        } catch (error) {
            console.error("Warnings command error:", error);
            await ctx.reply("Could not read warning information.");
        }
    });
};
