
const db = require("../database");

module.exports = (bot) => {

    bot.on("message:new_chat_members", async (ctx) => {

        try {
            // Read group settings.
            const groups = await db.readJSON("groups.json");

            const chatId = String(ctx.chat.id);
            const settings = groups[chatId];

            // Welcome messages are enabled by default.
            if (settings?.welcome === false) {
                return;
            }

            // Get new human members.
            const members = ctx.message.new_chat_members;

            const names = members
                .filter(member => !member.is_bot)
                .map(member => member.first_name);

            // Ignore events containing only bots.
            if (names.length === 0) {
                return;
            }

            // Send welcome message.
            await ctx.reply(
                `Welcome ${names.join(", ")}! 🎉\n` +
                `We're happy to have you here in ${ctx.chat.title}.`
            );

        } catch (error) {
            console.error("Welcome handler error:", error);
        }

    });

};

