const { MongoClient, ObjectId } = require("mongodb");
const slugify = require("slugify");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function migrate() {
    try {
        await client.connect();
        console.log("Connected to MongoDB for migration");
        const db = client.db("job-portal-db");
        const collection = db.collection("demoJobs");

        const jobs = await collection.find({}).toArray();
        console.log(`Found ${jobs.length} jobs to check/migrate`);

        let updatedCount = 0;
        for (const job of jobs) {
            if (!job.slug) {
                // Generate slug
                const baseSlug = slugify(job.jobTitle, { lower: true, strict: true });
                // Append last 6 chars of ID to ensure uniqueness
                const uniqueSlug = `${baseSlug}-${job._id.toString().slice(-6)}`;

                await collection.updateOne(
                    { _id: job._id },
                    { $set: { slug: uniqueSlug } }
                );
                updatedCount++;
                console.log(`Updated job: ${job.jobTitle} -> ${uniqueSlug}`);
            } else {
                if (updatedCount === 0) console.log(`Skipping job (already has slug): ${job.jobTitle}, slug: ${job.slug}`);
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} jobs.`);

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await client.close();
    }
}

migrate();
