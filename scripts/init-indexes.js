const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

async function initIndexes() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db("job-portal-db");
        const jobCollections = db.collection("demoJobs");

        console.log("Creating unique index on externalId and source...");
        await jobCollections.createIndex({ externalId: 1, source: 1 }, { unique: true });

        console.log("Creating index on postingDate...");
        await jobCollections.createIndex({ postingDate: 1 });

        console.log("Creating index on expiresAt...");
        await jobCollections.createIndex({ expiresAt: 1 });

        console.log("Creating index on source...");
        await jobCollections.createIndex({ source: 1 });

        console.log("Indexes initialized successfully.");
    } catch (error) {
        console.error("Error initializing indexes:", error);
    } finally {
        await client.close();
    }
}

initIndexes();
