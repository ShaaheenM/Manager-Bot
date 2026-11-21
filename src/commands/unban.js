const adminOnly = require("../middleware/adminOnly");
const getTarget = require("../utils/getTarget");

module.exports = (bot) => {
    bot.command("unban", adminOnly, async (ctx) => {
        const target = await getTarget(ctx);

        if (!target) return;

        try {
            await ctx.api.unbanChatMember(
                ctx.chat.id,
                target.id,
                { only_if_banned: true }
            );

            await ctx.reply(
                `✅ ${target.first_name} has been unbanned.`
            );

        } catch (error) {
            console.error("Unban error:", error);

            await ctx.reply(
                "Could not unban this member."
            );
        }
    });
};
