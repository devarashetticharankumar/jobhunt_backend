const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const { runFetcher } = require("./cron/jobFetcher");
dotenv.config();

async function testAggregator() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db("job-portal-db");
        console.log("Connected to DB, triggering fetcher manually...");
        await runFetcher(db);
        console.log("Fetcher test complete.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await client.close();
    }
}

testAggregator();
