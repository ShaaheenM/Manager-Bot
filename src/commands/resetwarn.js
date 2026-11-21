const adminOnly = require("../middleware/adminOnly");
const warnings = require("../utils/warnings");

module.exports = (bot) => {
    bot.command("resetwarn", adminOnly, async (ctx) => {
        const target = ctx.message.reply_to_message?.from;

        if (!target) {
            return ctx.reply(
                "Reply to a member's message with /resetwarn."
            );
        }

        try {
            await warnings.resetWarnings(
                ctx.chat.id,
                target.id
            );

            await ctx.reply(
                `✅ Warnings reset for ${target.first_name}.`
            );

        } catch (error) {
            console.error("Reset warning error:", error);
            await ctx.reply("Could not reset warnings.");
        }
    });
};
