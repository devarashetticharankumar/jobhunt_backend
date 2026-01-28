const cron = require("node-cron");
const { scrapeAndPostJobs } = require("../services/jobScraperService");

const setupJobScraper = (db) => {
    console.log("Initializing Job Scraper Schedule...");

    const now = new Date();
    console.log(`Job Scraper Initialized. Server Time: ${now.toString()}`);

    // Continuous Alternating Scraper Loop
    const startContinuousScraping = async () => {
        let isIndia = true; // Start with India

        // Infinite loop to keep scraping running
        while (true) {
            try {
                const location = isIndia ? "India" : "United States";
                console.log(`\n--- Starting Scrape Cycle for: ${location} ---`);

                // Scrape jobs
                await scrapeAndPostJobs(db, location);

                console.log(`--- Finished Scrape Cycle for ${location} ---`);
                console.log("Waiting 30 seconds before next cycle...\n");

                // Toggle location for next run
                isIndia = !isIndia;

                // Wait 30 seconds before next scrape
                await new Promise(resolve => setTimeout(resolve, 30000));

            } catch (error) {
                console.error("Continuous Scraper Error:", error);
                console.log("Error occurred. Waiting 1 minute before retrying...");
                // Wait longer significantly on error to avoid rapid failure loops
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        }
    };

    // Start the loop (fire and forget, don't await blocking the server startup)
    startContinuousScraping();
};

module.exports = setupJobScraper;
