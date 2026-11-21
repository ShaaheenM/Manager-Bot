const fs = require("fs");
const path = require("path");

const logFile = path.join(
    process.cwd(),
    "logs",
    "bot.log"
);

function writeLog(level, message, error = null) {
    const timestamp = new Date().toISOString();

    let logMessage =
        `[${timestamp}] [${level}] ${message}`;

    if (error) {
        logMessage +=
            ` | Error: ${error.stack || error.message || error}`;
    }

    logMessage += "\n";

    console.log(logMessage.trim());

    fs.appendFile(logFile, logMessage, (err) => {
        if (err) {
            console.error("Could not write log:", err);
        }
    });
}

module.exports = {
    info: (message) => writeLog("INFO", message),
    warn: (message) => writeLog("WARN", message),
    error: (message, error) =>
        writeLog("ERROR", message, error)
};
