const db = require("../database");

async function getCount(chatId, userId) {
    const warnings = await db.readJSON("warnings.json");

    return warnings[String(chatId)]?.[String(userId)] || 0;
}

async function addWarning(chatId, userId) {
    let count = 0;

    await db.updateJSON("warnings.json", (data) => {
        const groupId = String(chatId);
        const memberId = String(userId);

        if (!data[groupId]) {
            data[groupId] = {};
        }

        data[groupId][memberId] =
            (data[groupId][memberId] || 0) + 1;

        count = data[groupId][memberId];

        return data;
    });

    return count;
}

async function resetWarnings(chatId, userId) {
    await db.updateJSON("warnings.json", (data) => {
        const groupId = String(chatId);
        const memberId = String(userId);

        if (data[groupId]) {
            delete data[groupId][memberId];
        }

        return data;
    });
}

module.exports = {
    getCount,
    addWarning,
    resetWarnings
};
