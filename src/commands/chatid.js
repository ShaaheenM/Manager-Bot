module.exports = (bot) => {

    bot.command("chatid", async (ctx) => {

        const chat = ctx.chat;

        await ctx.reply(
            `Chat ID: ${chat.id}\n` +
            `Chat type: ${chat.type}`
        );

    });

};
