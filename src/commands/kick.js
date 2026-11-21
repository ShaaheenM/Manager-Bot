const adminOnly = require("../middleware/adminOnly");
const getTarget = require("../utils/getTarget");

module.exports = (bot) => {
    bot.command("kick", adminOnly, async (ctx) => {
        const target = await getTarget(ctx);

        if (!target) return;

        try {
            // Remove the member by banning them.
            await ctx.api.banChatMember(
                ctx.chat.id,
                target.id
            );

            // Immediately remove the ban.
            await ctx.api.unbanChatMember(
                ctx.chat.id,
                target.id,
                { only_if_banned: true }
            );

            await ctx.reply(
                `👢 ${target.first_name} has been kicked.`
            );

        } catch (error) {
            console.error("Kick error:", error);

            await ctx.reply(
                "The kick operation failed. Check the bot's permissions."
            );
        }
    });
};
