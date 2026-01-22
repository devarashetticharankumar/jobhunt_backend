const cron = require("node-cron");
const { scrapeAndPostJobs } = require("../services/jobScraperService");

const setupJobScraper = (db) => {
    console.log("Initializing Job Scraper Schedule...");

    const now = new Date();
    console.log(`Job Scraper Initialized. Server Time: ${now.toString()}`);

    // TEST SCHEDULE: Run every minute to verify automation (User Request)
    cron.schedule("* * * * *", async () => {
        console.log("TEST CRON: Running immediate scrapers test at", new Date().toISOString());
        try {
            await scrapeAndPostJobs(db, "United States");
        } catch (error) {
            console.error("TEST CRON Failed:", error);
        }
    }, { timezone: "Asia/Kolkata" });

    // Schedule for 8:00 AM - United States
    cron.schedule("0 8 * * *", async () => {
        console.log("Running scheduled job scraping (USA Morning) at", new Date().toISOString());
        try {
            await scrapeAndPostJobs(db, "United States");
            console.log("USA Morning scraping completed successfully");
        } catch (error) {
            console.error("USA Morning scraping failed:", error);
        }
    }, {
        timezone: "America/New_York" // Assuming USA schedule relative to EST/EDT
    });

    // Schedule for 1:00 PM (13:00) - India
    cron.schedule("0 13 * * *", async () => {
        console.log("Running scheduled job scraping (India Afternoon) at", new Date().toISOString());
        try {
            await scrapeAndPostJobs(db, "India");
            console.log("India Afternoon scraping completed successfully");
        } catch (error) {
            console.error("India Afternoon scraping failed:", error);
        }
    }, {
        timezone: "Asia/Kolkata"
    });

    // Schedule for 6:00 PM (18:00) - United States
    cron.schedule("0 18 * * *", async () => {
        console.log("Running scheduled job scraping (USA Evening) at", new Date().toISOString());
        try {
            await scrapeAndPostJobs(db, "United States");
            console.log("USA Evening scraping completed successfully");
        } catch (error) {
            console.error("USA Evening scraping failed:", error);
        }
    }, {
        timezone: "America/New_York"
    });
};

module.exports = setupJobScraper;
