const startCommand = require("./start");
const helpCommand = require("./help");
const chatidCommand = require("./chatid");

module.exports = (bot) => {

    startCommand(bot);
    helpCommand(bot);
    chatidCommand(bot);

};
