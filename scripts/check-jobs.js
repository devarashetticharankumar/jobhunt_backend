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

        const count = await collection.countDocuments({});
        console.log(`Total jobs in demoJobs: ${count}`);

        const jobs = await collection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
        console.log(`Found ${jobs.length} jobs.`);
        jobs.forEach((job, i) => {
            console.log(`Job ${i + 1}: Title: ${job.jobTitle}, Slug: ${job.slug}, Date: ${job.createdAt}`);
        });

    } finally {
        await client.close();
    }
}

check();
