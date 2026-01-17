const { MongoClient, ObjectId } = require("mongodb");
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

        // Fetch a few jobs to inspect
        const jobs = await collection.find({}).limit(1).toArray();
        console.log("Checking keys of first job:");
        jobs.forEach(job => {
            console.log(Object.keys(job));
        });

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

check();
