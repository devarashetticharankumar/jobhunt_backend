const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

async function checkSubscribers() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db("job-portal-db");
        const subscriptionsCollection = db.collection("EmailSubscriptions");
        const count = await subscriptionsCollection.countDocuments({});
        console.log(`Number of subscribers: ${count}`);
        const subscribers = await subscriptionsCollection.find({}).toArray();
        console.log("Subscribers:", subscribers);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

checkSubscribers();
