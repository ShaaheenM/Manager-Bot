const adminOnly = require("../middleware/adminOnly");
const getTarget = require("../utils/getTarget");

module.exports = (bot) => {
    bot.command("ban", adminOnly, async (ctx) => {
        const target = await getTarget(ctx);

        if (!target) return;

        try {
            await ctx.api.banChatMember(
                ctx.chat.id,
                target.id
            );

            await ctx.reply(
                `🚫 ${target.first_name} has been banned.`
            );

        } catch (error) {
            console.error("Ban error:", error);

            await ctx.reply(
                "Could not ban this member. Check the bot's permissions."
            );
        }
    });
};
