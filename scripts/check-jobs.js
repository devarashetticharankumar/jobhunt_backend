const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function check() {
    try {
        await client.connect();
        const db = client.db("job-portal-db");
        const collection = db.collection("demoJobs");

        const job = await collection.findOne({});
        console.log("Sample Job:", JSON.stringify(job, null, 2));

    } finally {
        await client.close();
    }
}

check();
