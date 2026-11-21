module.exports = async (ctx, userId) => {
    try {
        const member = await ctx.api.getChatMember(
            ctx.chat.id,
            userId
        );

        return (
            member.status === "creator" ||
            member.status === "administrator"
        );

    } catch (error) {
        console.error("Admin check error:", error);
        return false;
    }
};
