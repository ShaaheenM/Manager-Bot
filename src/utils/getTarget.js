module.exports = async (ctx) => {
    const target = ctx.message.reply_to_message?.from;

    if (!target) {
        await ctx.reply(
            "Reply to a member's message to use this command."
        );
        return null;
    }

    if (target.is_bot) {
        await ctx.reply("You cannot target a bot.");
        return null;
    }

    if (target.id === ctx.from.id) {
        await ctx.reply("You cannot target yourself.");
        return null;
    }

    try {
        const member = await ctx.api.getChatMember(
            ctx.chat.id,
            target.id
        );

        if (
            member.status === "creator" ||
            member.status === "administrator"
        ) {
            await ctx.reply(
                "You cannot target a group administrator."
            );
            return null;
        }

        return target;

    } catch (error) {
        console.error("Target check error:", error);

        await ctx.reply(
            "Could not verify this member."
        );

        return null;
    }
};
