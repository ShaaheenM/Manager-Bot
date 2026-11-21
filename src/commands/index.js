const startCommand = require("./start");
const helpCommand = require("./help");
const chatidCommand = require("./chatid");
const settingsCommand = require("./settings");
const adminCheck = require("./admincheck");
const welcomeCommand = require("./welcome");
const antispamCommand = require("./antispam");
const warnCommand = require("./warn");
const warningsCommand = require("./warnings");
const resetWarnCommand = require("./resetwarn");
const banCommand = require("./ban");
const unbanCommand = require("./unban");
const kickCommand = require("./kick");
const antiLinkCommand = require("./antilink");
const slowModeCommand = require("./slowmode");
//const settingsCommand = require("./settings");

module.exports = (bot) => {

    startCommand(bot);
    helpCommand(bot);
    chatidCommand(bot);
    settingsCommand(bot);
    adminCheck(bot);
    welcomeCommand(bot);
    antispamCommand(bot);
    warnCommand(bot);
    warningsCommand(bot);
    resetWarnCommand(bot);
    banCommand(bot);
    unbanCommand(bot);
    kickCommand(bot);
    antiLinkCommand(bot);
    settingsCommand(bot);
    slowModeCommand(bot);

};
