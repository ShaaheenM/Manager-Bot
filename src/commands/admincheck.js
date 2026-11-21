
const adminOnly = require("../middleware/adminOnly");

module.exports = (bot) => {

    bot.command("admincheck", adminOnly, async (ctx) => {

        await ctx.reply(
            "Congratulations! You are an administrator. ✅"
        );

    });

};

