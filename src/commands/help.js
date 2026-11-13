module.exports = (bot) => {

    bot.command("help", async (ctx) => {

        const message = `
Available commands:

/start - Start the bot
/help - Show this message
/chatid - Get chat information
`;

        await ctx.reply(message);

    });

};
