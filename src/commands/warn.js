const adminOnly = require("../middleware/adminOnly");
const warnings = require("../utils/warnings");

const WARNING_LIMIT = 5;
const MUTE_MINUTES = 30;

module.exports = (bot) => {
    bot.command("warn", adminOnly, async (ctx) => {
        const target = ctx.message.reply_to_message?.from;

        if (!target) {
            return ctx.reply(
                "Reply to a member's message with /warn."
            );
        }

        if (target.is_bot) {
            return ctx.reply("You cannot warn a bot.");
        }

        if (target.id === ctx.from.id) {
            return ctx.reply("You cannot warn yourself.");
        }

        try {
            // Check whether the target is an administrator.
            const member = await ctx.api.getChatMember(
                ctx.chat.id,
                target.id
            );

            if (
                member.status === "creator" ||
                member.status === "administrator"
            ) {
                return ctx.reply(
                    "You cannot warn a group administrator."
                );
            }

            const count = await warnings.addWarning(
                ctx.chat.id,
                target.id
            );

            let message =
                `⚠️ ${target.first_name} has been warned!\n` +
                `Warnings: ${count}/${WARNING_LIMIT}`;

            if (count >= WARNING_LIMIT) {
                const untilDate =
                    Math.floor(Date.now() / 1000) +
                    MUTE_MINUTES * 60;

                await ctx.api.restrictChatMember(
                    ctx.chat.id,
                    target.id,
                    {
                        permissions: {
                            can_send_messages: false
                        },
                        until_date: untilDate
                    }
                );

                message +=
                    `\n\n🔇 Member muted for ${MUTE_MINUTES} minutes.`;
            }

            await ctx.reply(message);

        } catch (error) {
            console.error("Warn command error:", error);

            await ctx.reply(
                "Could not warn this member. Check the bot's permissions."
            );
        }
    });
};
