const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const nodemailer = require("nodemailer");
const slugify = require("slugify");
const { ObjectId } = require("mongodb");
const { jobSchema } = require("../validation/schemas");

puppeteer.use(StealthPlugin());

// Synonym Map for Manual Rewriting
const synonymMap = {
    "required": ["essential", "needed", "mandatory", "vital"],
    "experience": ["background", "expertise", "history", "track record"],
    "team": ["squad", "group", "collaborators", "unit"],
    "develop": ["build", "create", "construct", "engineer"],
    "manage": ["oversee", "lead", "direct", "supervise"],
    "responsible for": ["in charge of", "tasked with", "accountable for", "handling"],
    "collaborate": ["work together", "partner", "cooperate", "liaise"],
    "design": ["architect", "plan", "model", "structure"],
    "analyze": ["examine", "assess", "evaluate", "study"],
    "implement": ["execute", "deploy", "apply", "enact"],
    "support": ["assist", "help", "aid", "back"],
    "knowledge": ["understanding", "familiarity", "grasp", "insight"],
    "communicate": ["convey", "interact", "correspond", "articulate"],
    "client": ["customer", "partner", "stakeholder", "consumer"],
    "goal": ["objective", "target", "aim", "milestone"],
    "proficient": ["skilled", "adept", "capable", "expert"],
    "ensure": ["guarantee", "make sure", "confirm", "verify"],
    "opportunity": ["chance", "opening", "prospect", "possibility"],
    "environment": ["atmosphere", "setting", "culture", "climate"],
    "skills": ["abilities", "competencies", "talents", "capabilities"]
};

const rewriteJobDescription = async (originalDescription, jobTitle, company) => {
    try {
        let rewrittenText = originalDescription;

        // 1. Synonym Replacement
        Object.keys(synonymMap).forEach(word => {
            const synonyms = synonymMap[word];
            const replacement = synonyms[Math.floor(Math.random() * synonyms.length)];
            const regex = new RegExp(`\\b${word}\\b`, "gi"); // Case-insensitive, whole word
            rewrittenText = rewrittenText.replace(regex, replacement);
        });

        // 2. Add Introduction
        const intros = [
            `<p><strong>${company}</strong> is looking for a talented <strong>${jobTitle}</strong> to join our growing team.</p>`,
            `<p>Exciting opportunity for a <strong>${jobTitle}</strong> at <strong>${company}</strong>. Apply now to make an impact!</p>`,
            `<p>Join <strong>${company}</strong> as a <strong>${jobTitle}</strong> and help us build the future.</p>`
        ];
        const randomIntro = intros[Math.floor(Math.random() * intros.length)];

        // 3. Add Conclusion
        const outros = [
            "<p>If you are passionate about this role, we'd love to hear from you!</p>",
            "<p>Ready to take the next step in your career? detailed application instructions are below.</p>",
            "<p>We are an equal opportunity employer and value diversity at our company.</p>"
        ];
        const randomOutro = outros[Math.floor(Math.random() * outros.length)];

        return `${randomIntro} ${rewrittenText} ${randomOutro}`;

    } catch (error) {
        console.error("Error manually rewriting job description:", error.message);
        return originalDescription;
    }
};

const transformDescription = (
    rawDescription,
    jobTitle,
    location,
    companyName,
    employmentType,
    experienceLevel,
    salaryRange,
    skills
) => {
    const seoJobTitle = `${jobTitle} at ${companyName} - ${location}`;

    // Basic cleanup if AI fails or for initial processing
    let cleanDescription = rawDescription
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/style="[^"]*"/gim, "")
        .replace(/class="[^"]*"/gim, "");

    return { description: cleanDescription, seoJobTitle };
};

const scrapeAndPostJobs = async (db, location = "United States") => {
    const jobCollections = db.collection("demoJobs");
    const subscriptionsCollection = db.collection("EmailSubscriptions");
    let browser = null;
    let browserRetries = 3;

    while (browserRetries > 0) {
        try {
            console.log(`Launching Browser (Attempt ${4 - browserRetries})...`);
            browser = await puppeteer.launch({
                headless: true, // Revert to legacy headless for stability
                ignoreHTTPSErrors: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--disable-gpu",
                    "--window-size=1920,1080",
                    "--disable-web-security",
                    "--disable-features=IsolateOrigins,site-per-process",
                ],
                executablePath:
                    process.env.NODE_ENV === "production"
                        ? process.env.PUPPETEER_EXECUTABLE_PATH
                        : puppeteer.executablePath(),
            });

            const page = await browser.newPage();

            // Optimization: Block images and CSS to save resources and prevent crashes
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            // Randomize User Agent
            const userAgents = [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ];
            await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

            await page.setViewport({ width: 1366, height: 768 });
            await page.setDefaultNavigationTimeout(60000);

            let url;
            if (location === "India") {
                url = "https://www.glassdoor.co.in/Job/india-software-jobs-jobs-SRCH_IL.0,5_IN115_KO6,19.htm?fromAge=1";
            } else {
                url = "https://www.glassdoor.co.in/Job/united-states-jobs-SRCH_IL.0,13_IN1.htm?fromAge=1";
            }

            console.log(`Scraping URL: ${url}`);

            // Navigate with simple waiter
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
            await new Promise(r => setTimeout(r, 5000)); // Stabilization delay

            // Check for blocking
            const title = await page.title();
            console.log(`Page Title: ${title}`);
            const bodyText = await page.evaluate(() => document.body.innerText).catch(() => "");
            if (bodyText.includes("Pardon Our Interruption") || title.includes("Human Verification")) {
                throw new Error("Blocked by Glassdoor");
            }

            // Gentle Scroll
            try {
                await page.evaluate(async () => {
                    for (let i = 0; i < 3; i++) {
                        window.scrollBy(0, 500);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                });
            } catch (e) { console.warn("Scroll error (ignoring):", e.message); }

            // Extract Jobs with simplified selector logic
            const rawJobs = await page.evaluate((loc) => {
                const selectors = [
                    "li[data-test='jobListing']",
                    ".react-job-listing",
                    "li[class*='react-job-listing']",
                    "li[class*='job']",
                    "li[class*='JobsList']"
                ];
                // Try to find the list container first for better scoping if possible, but global select is backup
                let jobElements = document.querySelectorAll(selectors.join(", "));
                console.log(`Found ${jobElements.length} job elements`);

                return Array.from(jobElements).map((job) => {
                    const linkElement = job.querySelector("a[class*='title'], a[data-test='job-link'], a");
                    let companyNameRaw =
                        job.querySelector(
                            "div[class*='employer'], span[class*='employer'], div[class*='company'], span[class*='company']"
                        )?.innerText || "Unknown";
                    const companyName = companyNameRaw.replace(/\s+\d+(\.\d+)?\s*$/, "").trim();
                    const logoElement = job.querySelector("img[class*='logo'], img[class*='avatar'], .employerLogo img");

                    return {
                        glassdoorLink: linkElement?.href || "",
                        companyName: companyName,
                        jobLocation: job.querySelector("div[class*='loc'], span[class*='loc'], [data-test='emp-location']")?.innerText || "Remote",
                        jobTitle: linkElement?.innerText || "Untitled Job",
                        listingLogo: logoElement?.src || null
                    };
                }).filter(j => j.glassdoorLink && j.jobTitle !== "Untitled Job");
            }, location);

            if (!rawJobs || rawJobs.length === 0) {
                console.warn("No jobs found. Possible selector mismatch or block.");
                throw new Error("No jobs found");
            }

            console.log(`Discovered ${rawJobs.length} potential jobs.`);
            const jobsToProcess = rawJobs.slice(0, 15); // Increased to 15

            const validatedJobs = [];

            for (const job of jobsToProcess) {
                // Check dupes
                const existingJob = await jobCollections.findOne({
                    $or: [{ glassdoorLink: job.glassdoorLink }, { jobTitle: job.jobTitle, companyName: job.companyName }]
                });
                if (existingJob) {
                    console.log(`Skipping existing: ${job.jobTitle}`);
                    continue;
                }

                // Initial basic job object
                let finalJob = { ...job };

                // Get Details
                try {
                    const detailPage = await browser.newPage();
                    // Block resources on detail page too but allow images momentarily if needed?
                    // Better to rely on listing logo if detail fails
                    await detailPage.setRequestInterception(true);
                    detailPage.on('request', (req) => {
                        if (['stylesheet', 'font', 'media'].includes(req.resourceType())) req.abort();
                        // Allow images on detail page to try and get better resolution logo? 
                        // Or keep blocking to prevent crash. Let's block for now and rely on listing logo 
                        // or text src extraction.
                        else if (req.resourceType() === 'image') req.abort();
                        else req.continue();
                    });

                    await detailPage.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

                    await detailPage.goto(job.glassdoorLink, { waitUntil: "domcontentloaded", timeout: 45000 });
                    await new Promise(r => setTimeout(r, 2000));

                    // Extract Details
                    const details = await detailPage.evaluate(() => {
                        return {
                            description: document.querySelector("div[class*='jobDescription'], div[class*='desc'], .jobDescriptionContent")?.innerHTML || "",
                            employmentType: document.querySelector("div[class*='employment'], span[class*='type']")?.innerText || "Full-time",
                            experienceLevel: document.querySelector("div[class*='experience'], span[class*='level']")?.innerText || "Mid-Level",
                            salaryRange: document.querySelector("div[class*='salary'], span[class*='salary']")?.innerText || null,
                            // Try to get logo from detail page if listing one was null
                            companyLogo: document.querySelector("img[class*='logo'], img[class*='avatar']")?.src || null
                        };
                    });

                    await detailPage.close();

                    // If description exists, rewrite it
                    if (details.description) {
                        console.log(`Rewriting: ${job.jobTitle}`);
                        const aiDescription = await rewriteJobDescription(details.description, job.jobTitle, job.companyName);
                        finalJob.description = aiDescription;

                        const { seoJobTitle } = transformDescription(
                            aiDescription, job.jobTitle, job.jobLocation, job.companyName,
                            details.employmentType, details.experienceLevel, details.salaryRange, []
                        );
                        finalJob.jobTitle = seoJobTitle;
                    } else {
                        finalJob.description = "Full details available at application link.";
                    }

                    // Prioritize detail logo, then listing logo, then fallback
                    finalJob.companyLogo = details.companyLogo || job.listingLogo || "https://jobnirvana.netlify.app/images/logo.png";
                    finalJob.employmentType = details.employmentType;
                    finalJob.experienceLevel = details.experienceLevel;

                    // Salary
                    let minPrice = " ", maxPrice = "Competitive Salary", salaryType = "Yearly";
                    if (details.salaryRange) {
                        const salaryMatch = details.salaryRange.match(/\$?(\d+[kT]?)\s*[–-]\s*\$?(\d+[kT]?)/i);
                        if (salaryMatch) {
                            minPrice = salaryMatch[1].replace("T", "k");
                            maxPrice = salaryMatch[2].replace("T", "k");
                        }
                    }
                    finalJob.minPrice = minPrice;
                    finalJob.maxPrice = maxPrice;
                    finalJob.salaryType = salaryType;

                } catch (detailErr) {
                    console.error(`Detail scrape failed for ${job.jobTitle}: ${detailErr.message}`);
                    finalJob.description = finalJob.description || "See application link for details.";
                    finalJob.companyLogo = job.listingLogo || "https://jobnirvana.netlify.app/images/logo.png";
                }

                // Finalize fields and remove temp fields
                delete finalJob.listingLogo; // Remove temp Joi validation error

                finalJob.skills = [{ label: "Software Development" }];
                finalJob.ApplyLink = job.glassdoorLink;
                finalJob.postedBy = "jobhunt2580@gmail.com";
                finalJob.slug = slugify(`${finalJob.jobTitle}-${Date.now()}`, { lower: true, strict: true });
                finalJob.createdAt = new Date();

                const { error } = jobSchema.validate(finalJob);
                if (!error) validatedJobs.push(finalJob);
                else console.warn(`Validation failed for ${finalJob.jobTitle}: ${error.message}`);
            }

            if (validatedJobs.length > 0) {
                await jobCollections.insertMany(validatedJobs);
                console.log(`Successfully inserted ${validatedJobs.length} jobs.`);

                // Notify
                const subscribers = await subscriptionsCollection.find({}).toArray();
                const subscriberEmails = subscribers.map(s => s.email);
                if (subscriberEmails.length > 0 && validatedJobs.length > 0) {
                    const sampleJob = validatedJobs[0];
                    let mailOptions = {
                        from: process.env.EMAIL_USERNAME,
                        to: subscriberEmails,
                        subject: `New Job: ${sampleJob.jobTitle}`,
                        html: `<h1>New Job Alert</h1><p>${sampleJob.jobTitle} at ${sampleJob.companyName}</p>`
                    };
                    try { await transporter.sendMail(mailOptions); } catch (e) { }
                }
            }

            // Success - break browser retry loop
            await browser.close();
            return validatedJobs;

        } catch (error) {
            console.error(`Browser Session Failed (Attempt ${4 - browserRetries}):`, error.message);
            if (browser) {
                try { await browser.close(); } catch (e) { }
            }
        }
        browserRetries--;
        await new Promise(r => setTimeout(r, 5000));
    }

    console.error("All browser retries failed.");
    return [];
};

module.exports = { scrapeAndPostJobs };
