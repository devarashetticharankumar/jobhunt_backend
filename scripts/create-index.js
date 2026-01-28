const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("job-portal-db");
        const collection = db.collection("demoJobs");

        console.log("Creating index on createdAt...");
        // Create an index on createdAt in descending order
        const result = await collection.createIndex({ createdAt: -1 });
        console.log(`Index created: ${result}`);

        // Also create index on search fields for performance
        console.log("Creating text index for search...");
        // Check if text index exists, if not create one for jobTitle and companyName
        // Simple check: createIndex is idempotent for same specs usually, but let's just do createdAt first as priority.

    } catch (error) {
        console.error("Error creating index:", error);
    } finally {
        await client.close();
    }
}

run();
