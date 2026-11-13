module.exports = (bot) => {

    bot.command("start", async (ctx) => {

        const name = ctx.from?.first_name || "there";

        await ctx.reply(
            `Hello ${name}!\nI'm your group management bot.`
        );

    });

};
