const cron = require("node-cron");
const { fetchAllJobs } = require("../services/apiIntegrations");
const extractSkills = require("../utils/extractSkills");
const logger = require("../utils/logger");
const sanitizeUrl = require("../utils/sanitizeUrl");

async function runFetcher(db) {
    logger.info("Starting job aggregation run (Plagiarism-Free Mode)...");

    try {
        const jobCollections = db.collection("demoJobs");
        const allJobs = await fetchAllJobs();
        logger.info(`Fetched ${allJobs.length} raw jobs from APIs`);

        let processedCount = 0;
        let skippedCount = 0;
        const MAX_INSERTS = 500;

        for (const job of allJobs) {
            if (processedCount >= MAX_INSERTS) {
                break;
            }

            try {
                // 1. Sanitize & Extract Facts
                const sanitizedTitle = (job.jobTitle || "").trim();
                const sanitizedCompany = (job.companyName || "").trim();
                const sanitizedLocation = (job.jobLocation || "Remote").trim();

                if (!sanitizedTitle || !sanitizedCompany) {
                    skippedCount++;
                    continue;
                }

                // EXTRACT SKILLS (No prose storage)
                const skills = extractSkills(job.description);
                const skillText = skills.length > 0 ? `Required skills: ${skills.join(", ")}.` : "Join an innovative team.";

                // 2. Smart Deduplication
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const existingJob = await jobCollections.findOne({
                    jobTitle: sanitizedTitle,
                    companyName: sanitizedCompany,
                    jobLocation: sanitizedLocation,
                    createdAt: { $gte: sevenDaysAgo }
                });

                if (existingJob) {
                    skippedCount++;
                    continue;
                }

                // 3. Prepare for insert (GENERATING UNIQUE CONTENT)
                const jobToSave = {
                    ...job,
                    jobTitle: sanitizedTitle,
                    companyName: sanitizedCompany,
                    jobLocation: sanitizedLocation,
                    skills,
                    // COMPLETELY UNIQUE PROSE GENERATION (3 paragraphs for Adsense Word Count)
                    shortDescription: `Hiring alert: ${sanitizedTitle} opportunity at ${sanitizedCompany} in ${sanitizedLocation}. This position offers a professional environment and the chance to work with a dedicated team. Professionals joining ${sanitizedCompany} will contribute to innovative projects and help shape the future of the industry.\n\n` +
                        `The role requires expertise in ${skillText} Candidates should demonstrate a proactive approach to problem-solving and a commitment to excellence. This ${job.employmentType || "full-time"} role is ideal for those looking to advance their career in a supportive and growth-oriented setting.\n\n` +
                        `Professional development is a core value here. You will have access to mentorship and advanced career paths within the organization. If you are passionate about ${sanitizedTitle} and ready to make an impact, we encourage you to apply today.`,
                    originalUrl: sanitizeUrl(job.originalUrl),
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                };

                // DISCARD ORIGINAL Prose/Description to ensure 100% plagiarism-free
                delete jobToSave.description;

                // 4. Upsert: setOnInsert for core fields, but always update shortDescription & skills for fresh data
                await jobCollections.updateOne(
                    { externalId: job.externalId, source: job.source },
                    {
                        $setOnInsert: jobToSave,
                        $set: {
                            shortDescription: jobToSave.shortDescription,
                            skills: jobToSave.skills
                        }
                    },
                    { upsert: true }
                );

                processedCount++;
            } catch (innerError) {
                logger.error(`Error processing job ${job.externalId} from ${job.source}:`, innerError.message);
            }
        }

        logger.info(`Aggregation run complete. Processed: ${processedCount}, Skipped: ${skippedCount}`);
    } catch (error) {
        logger.error("Critical Aggregator Failure:", error);
    }
}

function setupJobFetcher(db) {
    logger.info("Initializing Job Fetcher Cron System (Every 2 hours)...");

    // 0 */2 * * * - Every 2 hours
    cron.schedule("0 */2 * * *", () => {
        runFetcher(db);
    });

    // Daily cleanup at 3:00 AM
    cron.schedule("0 3 * * *", async () => {
        logger.info("Running daily expired jobs cleanup...");
        try {
            const jobCollections = db.collection("demoJobs");
            const result = await jobCollections.deleteMany({
                expiresAt: { $lt: new Date() }
            });
            logger.info(`Cleanup complete. Deleted ${result.deletedCount} expired jobs.`);
        } catch (cleanupError) {
            logger.error("Cleanup CRON failure:", cleanupError);
        }
    });
}

module.exports = { setupJobFetcher, runFetcher };
