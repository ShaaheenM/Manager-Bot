
module.exports = async (ctx, next) => {
    // Only allow group commands.
    if (
        !ctx.chat ||
        !["group", "supergroup"].includes(ctx.chat.type)
    ) {
        return ctx.reply(
            "This command can only be used in groups."
        );
    }

    try {
        // Get the user's group status.
        const member = await ctx.api.getChatMember(
            ctx.chat.id,
            ctx.from.id
        );

        // Check administrator permissions.
        const isAdmin =
            member.status === "creator" ||
            member.status === "administrator";

        if (!isAdmin) {
            return ctx.reply(
                "Sorry! Only group administrators can use this command."
            );
        }

        // Continue to the command handler.
        await next();

    } catch (error) {
        console.error("Admin middleware error:", error);

        await ctx.reply(
            "I couldn't verify your administrator permissions."
        );
    }
};

