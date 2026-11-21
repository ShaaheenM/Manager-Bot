const adminOnly = require("../middleware/adminOnly");
const settings = require("../utils/groupSettings");

const FEATURES = {
    welcome: {
        key: "welcome",
        label: "Welcome messages",
        default: true
    },
    antispam: {
        key: "antiSpam",
        label: "Anti-spam",
        default: false
    },
    antilink: {
        key: "antiLink",
        label: "Anti-link",
        default: false
    },
    slowmode: {
        key: "slowMode",
        label: "Slow-mode",
        default: false
    }
};

module.exports = (bot) => {
    bot.command("settings", adminOnly, async (ctx) => {
        const chatId = String(ctx.chat.id);

        const args = ctx.match.trim().toLowerCase().split(/\s+/);

        const feature = args[0];
        const option = args[1];

        try {
            // Display all settings.
            if (!feature) {
                const data = await settings.getSettings(chatId);

                const welcome =
                    data.welcome !== false;

                const antispam =
                    data.antiSpam === true;

                const antilink =
                    data.antiLink === true;

		const slowMode =
		    data.slowMode === true;
		const slowSeconds =
		    data.slowModeSeconds || 10;

                return ctx.reply(
                    "⚙️ Group Settings\n\n" +
                    `Welcome: ${welcome ? "ON ✅" : "OFF ❌"}\n` +
                    `Anti-spam: ${antispam ? "ON ✅" : "OFF ❌"}\n` +
                    `Anti-link: ${antilink ? "ON ✅" : "OFF ❌"}\n` +
		    `Slow mode: ${slowMode ? "ON ✅️" : "OFF ❌️"}\n\n`+
                    "Change settings:\n" +
                    "/settings welcome on\n" +
                    "/settings welcome off\n" +
                    "/settings antispam on\n" +
                    "/settings antispam off\n" +
                    "/settings antilink on\n" +
                    "/settings antilink off\n" +
		    "/settings slowmode on\n"+
		    "/settings slowmode off"
                );
            }

            // Check whether the feature exists.
            const selected = FEATURES[feature];

            if (!selected) {
                return ctx.reply(
                    "Unknown setting.\n\n" +
                    "Available: welcome, antispam, antilink, slowmode"
                );
            }

            // Validate the requested value.
            if (!["on", "off"].includes(option)) {
                return ctx.reply(
                    `Usage: /settings ${feature} on\n` +
                    `Or: /settings ${feature} off`
                );
            }

            // Save the new setting.
            const value = option === "on";

            await settings.updateSetting(
                chatId,
                selected.key,
                value
            );

            await ctx.reply(
                `✅ ${selected.label} is now ${option.toUpperCase()}!`
            );

        } catch (error) {
            console.error("Settings command error:", error);

            await ctx.reply(
                "Could not update group settings."
            );
        }
    });
};
