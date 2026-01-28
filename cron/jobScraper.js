const cron = require("node-cron");
const { scrapeAndPostJobs } = require("../services/jobScraperService");

const setupJobScraper = (db) => {
    console.log("Initializing Job Scraper Schedule...");

    const now = new Date();
    console.log(`Job Scraper Initialized. Server Time: ${now.toString()}`);

    // List of Target URLs to Rotate Through
    const SCRAPE_TARGETS = [
        { name: "India Software", url: "https://www.glassdoor.co.in/Job/india-software-jobs-jobs-SRCH_IL.0,5_IN115_KO6,19.htm?fromAge=1" },
        { name: "US Software (General)", url: "https://www.glassdoor.co.in/Job/united-states-software-jobs-jobs-SRCH_IL.0,13_IN1_KO14,27.htm?fromAge=1" },
        { name: "US Software (Backend/FullStack/AI)", url: "https://www.glassdoor.co.in/Job/jobs.htm?locId=1&locT=N&sc.locationSeoString=United+States&sc.occupationParam=software+engineer+%28backend+%2F+full+stack+%2F+AI+%29&fromAge=1" },
        { name: "US Data Scientist/Analyst", url: "https://www.glassdoor.co.in/Job/jobs.htm?locId=1&locT=N&sc.locationSeoString=United+States&sc.occupationParam=data+scientist+%2F+data+analyst&fromAge=1" },
        { name: "US Cloud Engineer", url: "https://www.glassdoor.co.in/Job/jobs.htm?locId=1&locT=N&sc.locationSeoString=United+States&sc.occupationParam=cloud+engineer+%28AWS%2C+Azure%2C+GCP%29&fromAge=1" },
        { name: "US DevOps Engineer", url: "https://www.glassdoor.co.in/Job/united-states-devops-engineer-jobs-SRCH_IL.0,13_IN1_KO14,29.htm?fromAge=1" },
        { name: "US Cyber Security Analyst", url: "https://www.glassdoor.co.in/Job/united-states-cyber-security-analyst-jobs-SRCH_IL.0,13_IN1_KO14,36.htm?fromAge=1" },
        { name: "US AI/ML Engineer", url: "https://www.glassdoor.co.in/Job/jobs.htm?sc.occupationParam=AI+%2F+Meachine+learning+engineer&sc.locationSeoString=United+States&locId=1&locT=N" },
        { name: "US Blockchain Developer", url: "https://www.glassdoor.co.in/Job/united-states-block-chain-developer-jobs-SRCH_IL.0,13_IN1_KO14,35.htm?fromAge=1" },
        { name: "US Remote Software Engineer", url: "https://www.glassdoor.co.in/Job/united-states-remote-software-engineer-jobs-SRCH_IL.0,13_IN1_KO14,38.htm?fromAge=1" },
        { name: "US Remote Data Analyst", url: "https://www.glassdoor.co.in/Job/united-states-remote-data-analyst-jobs-SRCH_IL.0,13_IN1_KO14,33.htm?fromAge=1" },
        { name: "US Remote Product Manager", url: "https://www.glassdoor.co.in/Job/united-states-remote-product-manager-jobs-SRCH_IL.0,13_IN1_KO14,36.htm?fromAge=1" },
        { name: "US Remote QA Automation", url: "https://www.glassdoor.co.in/Job/united-states-remote-qa-automation-engineer-jobs-SRCH_IL.0,13_IN1_KO14,43.htm?fromAge=1" },
        { name: "US Remote UI/UX Designer", url: "https://www.glassdoor.co.in/Job/jobs.htm?locId=1&locT=N&sc.locationSeoString=United+States&sc.occupationParam=remote+ui%2Fux+designer&fromAge=1" },
        { name: "US Investment Banking", url: "https://www.glassdoor.co.in/Job/united-states-investment-banking-jobs-jobs-SRCH_IL.0,13_IN1_KO14,37.htm?fromAge=1" },
        { name: "US Financial Analyst", url: "https://www.glassdoor.co.in/Job/united-states-financial-analyst-jobs-SRCH_IL.0,13_IN1_KO14,31.htm?fromAge=1" },
        { name: "US Risk Analyst", url: "https://www.glassdoor.co.in/Job/united-states-risk-analyst-jobs-SRCH_IL.0,13_IN1_KO14,26.htm?fromAge=1" },
        { name: "US Fintech", url: "https://www.glassdoor.co.in/Job/united-states-fintech-jobs-jobs-SRCH_IL.0,13_IN1_KO14,26.htm?fromAge=1" },
        { name: "US Accounting/CPA", url: "https://www.glassdoor.co.in/Job/jobs.htm?locId=1&locT=N&sc.locationSeoString=United+States&sc.occupationParam=accounting+%2F+CPA+jobs&fromAge=1" }
    ];

    // Continuous Alternating Scraper Loop
    const startContinuousScraping = async () => {
        let currentIndex = 0;

        // Infinite loop to keep scraping running
        while (true) {
            try {
                const target = SCRAPE_TARGETS[currentIndex];
                console.log(`\n--- Starting Scrape Cycle for: ${target.name} ---`);
                console.log(`Target URL: ${target.url}`);

                // Scrape jobs
                await scrapeAndPostJobs(db, target.url);

                console.log(`--- Finished Scrape Cycle for ${target.name} ---`);
                console.log("Waiting 30 seconds before next cycle...\n");

                // Prepare for next target
                currentIndex = (currentIndex + 1) % SCRAPE_TARGETS.length;

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
