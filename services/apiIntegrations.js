const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const logger = require("../utils/logger");

// Configure axios with retry logic
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    onRetry: (retryCount, error) => {
        logger.warn(`Retry attempt #${retryCount} for ${error.config.url}`);
    },
});

const API_SOURCES = {
    REMOTIVE: "https://remotive.com/api/remote-jobs",
    ARBEITNOW: "https://www.arbeitnow.com/api/job-board-api",
    THE_MUSE: "https://www.themuse.com/api/public/jobs?page=1", // Simplified for now
};

/**
 * Fetches jobs from Remotive API.
 */
async function fetchRemotive() {
    try {
        logger.info("Fetching from Remotive...");
        const response = await axios.get(API_SOURCES.REMOTIVE, { timeout: 30000 });
        return (response.data.jobs || []).map(job => ({
            externalId: String(job.id),
            jobTitle: job.title,
            companyName: job.company_name,
            jobLocation: job.candidate_required_location || "Remote",
            employmentType: job.job_type || "Full-time",
            description: job.description,
            companyLogo: job.company_logo,
            originalUrl: job.url,
            postingDate: new Date(job.publication_date),
            source: "Remotive"
        }));
    } catch (error) {
        logger.error("Remotive API failure:", error.message);
        return [];
    }
}

/**
 * Fetches jobs from Arbeitnow API.
 */
async function fetchArbeitnow() {
    try {
        logger.info("Fetching from Arbeitnow...");
        const response = await axios.get(API_SOURCES.ARBEITNOW, { timeout: 30000 });
        return (response.data.data || []).map(job => ({
            externalId: String(job.slug),
            jobTitle: job.title,
            companyName: job.company_name,
            jobLocation: job.location,
            employmentType: job.job_types?.[0] || "Full-time",
            description: job.description,
            companyLogo: "", // Arbeitnow doesn't provide logo in listing usually
            originalUrl: job.url,
            postingDate: new Date(job.created_at || Date.now()),
            source: "Arbeitnow"
        }));
    } catch (error) {
        logger.error("Arbeitnow API failure:", error.message);
        return [];
    }
}

/**
 * Fetches jobs from The Muse API.
 */
async function fetchTheMuse() {
    try {
        logger.info("Fetching from The Muse...");
        const response = await axios.get(API_SOURCES.THE_MUSE, { timeout: 30000 });
        return (response.data.results || []).map(job => ({
            externalId: String(job.id),
            jobTitle: job.name,
            companyName: job.company.name,
            jobLocation: job.locations?.[0]?.name || "Remote",
            employmentType: job.type || "Full-time",
            description: job.contents,
            companyLogo: "",
            originalUrl: job.refs.landing_page,
            postingDate: new Date(job.publication_date),
            source: "The Muse"
        }));
    } catch (error) {
        logger.error("The Muse API failure:", error.message);
        return [];
    }
}

async function fetchAllJobs() {
    const remotiveJobs = await fetchRemotive();
    const arbeitnowJobs = await fetchArbeitnow();
    const theMuseJobs = await fetchTheMuse();

    return [...remotiveJobs, ...arbeitnowJobs, ...theMuseJobs];
}

module.exports = { fetchAllJobs };
