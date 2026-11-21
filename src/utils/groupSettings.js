const db = require("../database");

async function getSettings(chatId) {
    const groups = await db.readJSON("groups.json");

    return groups[String(chatId)] || {};
}

async function updateSetting(chatId, setting, value) {
    await db.updateJSON("groups.json", (data) => {
        const id = String(chatId);

        if (!data[id]) {
            data[id] = {};
        }

        data[id][setting] = value;

        return data;
    });
}

module.exports = {
    getSettings,
    updateSetting
};
