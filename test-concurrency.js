
const db = require("./src/database");

async function test() {
    console.log("Starting concurrent update test...");

    // Reset test data
    await db.writeJSON("users.json", {
        testResults: []
    });

    // Create 20 updates at the same time
    const updates = Array.from(
        { length: 20 },
        (_, i) => {
            return db.updateJSON("users.json", (data) => {
                data.testResults.push(i + 1);
                return data;
            });
        }
    );

    // Wait until all updates finish
    await Promise.all(updates);

    // Read the final result
    const result = await db.readJSON("users.json");

    console.log("Expected updates: 20");
    console.log("Actual updates:", result.testResults.length);
    console.log("Saved values:", result.testResults);

    if (result.testResults.length === 20) {
        console.log("SUCCESS: No updates were lost!");
    } else {
        console.log("FAILED: Some updates were lost.");
    }
}

test().catch(console.error);

