module.exports = (bot) => {

    bot.command("help", async (ctx) => {

        const message = `
Available commands:

/start - Start the bot
/help - Show this message
/chatid - Get chat information
/welcome - see or change welcome status
/settings - see the settings
/antispam - see or change antispam ststus
`;

        await ctx.reply(message);

    });

};
