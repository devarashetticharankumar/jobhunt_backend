const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const nodemailer = require("nodemailer");
const slugify = require("slugify");
const { ObjectId } = require("mongodb");
const { jobSchema } = require("../validation/schemas");

puppeteer.use(StealthPlugin());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Manual Template Libraries for Plagiarism-Free Content (>700 Words)
const templates = {
    about: [
        "The modern professional landscape is constantly evolving, requiring dedicated individuals who can adapt and thrive in dynamic settings. This specific role offers a comprehensive platform for high-impact contributions and professional excellence. At its core, the position is designed for those who possess a deep-seated passion for innovation and a meticulous approach to problem-solving. Joining this team means becoming part of a forward-thinking culture that values integrity, collaboration, and the pursuit of industry-leading standards. The successful candidate will find themselves immersed in a professional environment that encourages creative thinking and rewards initiative. We believe that true growth stems from a combination of technical proficiency and the ability to view challenges from multiple perspectives. This role is not just a job; it is a significant step in a career journey designed for those who aim to make a tangible difference in their respective field. Every day presents new opportunities to refine skills, engage with talented peers, and contribute to projects that have a lasting influence. The commitment to excellence is reflected in every aspect of the organizational structure, providing a stable yet exciting foundation for long-term career satisfaction.",
        "Navigating the complexities of today's market requires a unique blend of expertise and adaptability. We are currently seeking a professional who embodies these traits and is ready to take on a role that is both challenging and rewarding. This position is strategically positioned to drive meaningful results while offering the individual ample room for personal and professional development. The organizational philosophy centers on the belief that diverse perspectives lead to the most effective solutions. In this role, you will be empowered to explore new ideas, implement efficient processes, and collaborate with a group of like-minded experts. The work environment is characterized by a high degree of mutual respect and a collective drive toward achieving ambitious milestones. We prioritize a culture where open communication and continuous learning are the norm, rather than the exception. By joining our team, you are entering a space where your contributions are recognized and your potential is nurtured. This is an invitation to bring your expertise to a firm that is dedicated to setting new benchmarks in quality and innovation within the industry.",
        "In an era where industry standards are constantly being redefined, the need for skilled and motivated professionals has never been greater. This role provides a unique vantage point from which to influence key outcomes and contribute to the broader success of the organization. We are looking for an individual who is not only technically capable but also aligns with a culture of excellence and high-performance standards. The responsibilities inherent in this position require a balanced approach, combining strategic oversight with tactical execution. Our workplace is designed to foster professional maturity and encourage individuals to take ownership of their professional trajectory. We understand that the most successful projects are the result of collective effort and shared vision. Consequently, the workspace is highly collaborative, emphasizing the importance of team synergy and effective communication. By choosing to apply for this role, you are signaling your readiness to engage with complex tasks and contribute to a legacy of professional achievement. We are committed to providing the resources and support necessary for you to excel and reach your full career potential."
    ],
    growth: [
        "Professional development is a cornerstone of a fulfilling career, and this organization is deeply committed to the long-term growth of its members. We provide a structured yet flexible path for advancement, ensuring that every individual has the opportunity to expand their horizons. Through a combination of internal mentorship and access to specialized training resources, we empower our employees to stay at the cutting edge of industry trends. The career trajectory here is designed to reward merit and proactive leadership, offering a clear roadmap for those who aspire to senior roles. We believe that when our people grow, the organization grows as well, making personal development a mutual priority.",
        "The journey toward professional mastery is paved with continuous learning and the courage to take on new challenges. Within our framework, career advancement is seen as a natural progression of consistent excellence and a dedication to self-improvement. We offer numerous avenues for skill enhancement, ranging from collaborative workshops to independent study support. Our performance feedback mechanisms are designed to be constructive and forward-looking, helping individuals identify areas for improvement and celebrate their successes. This is an environment where curiosity is encouraged and the pursuit of knowledge is viewed as a vital component of professional identity.",
        "Success in the modern workplace is often defined by one's ability to evolve alongside the industry. Our organization fosters a culture of lifelong learning, providing the infrastructure needed for individuals to pivot and adapt as the market shifts. From internal project leads to specialized technical tracks, the opportunities for progression are diverse and tailored to individual strengths. We prioritize internal mobility, preferring to cultivate and promote talent from within our own ranks. This commitment to our workforce ensures a high degree of stability and a shared sense of purpose, making every contribution a building block for future leadership."
    ],
    insights: [
        "Staying competitive in today's workforce requires more than just technical skill; it necessitates an understanding of broader market dynamics and the ability to anticipate future needs. Professionals who succeed are those who maintain a proactive stance toward industry news and technological breakthroughs. Networking and cross-functional collaboration remain essential components of a successful career strategy, as they provide diverse perspectives that are essential for high-level problem solving. Furthermore, the integration of soft skills—such as emotional intelligence and effective communication—is increasingly becoming the differentiator for top-tier talent in every sector. Understanding the intersection of technology and human intuition is becoming a cornerstone of modern professional success.",
        "The rise of digital transformation has fundamentally altered the way we approach work, emphasizing the importance of agility and technological fluency. To thrive in this environment, individuals must be comfortable working with a variety of digital tools and platforms while maintaining a focus on core professional principles. Resilience and the ability to manage change are now considered critical competencies for any high-growth role. As organizations become more data-driven, the capacity to interpret complex information and translate it into actionable strategies is a skill that continues to see incredible demand across all major industries. Navigating these changes requires a commitment to lifelong learning and a flexible mindset.",
        "Industry experts agree that the future of work will be characterized by a hybrid approach to problem solving, blending human creativity with automated efficiency. This shift requires professionals to redefine their roles and focus on areas where human intuition and ethical judgment are irreplaceable. Continuous professional education is no longer optional but a fundamental requirement for those who wish to remain relevant. Building a personal brand centered on reliability, expertise, and a commitment to quality is the most effective way to ensure long-term career security in an increasingly competitive global marketplace. Mastering the nuances of professional collaboration is key to long-term stability."
    ],
    tips: [
        "To maximize your success in the interview process for this role, we recommend focusing on your ability to articulate complex technical concepts to non-technical stakeholders. Prepare specific examples from your past projects where you demonstrated leadership or innovative thinking. Researching the organization's recent market performance and strategic goals will also provide you with a significant advantage during discussions. Remember that soft skills and cultural alignment are often weighed as heavily as technical credentials in high-impact professional environments. Consistency and preparation are your strongest tools for landing a premier position.",
        "When preparing for a role of this caliber, it is essential to emphasize your commitment to quality and efficient process management. Highlighting your experience with collaborative tools and your approach to cross-team synergy will resonate well with hiring managers. We also suggest reviewing common industry-standard problem-solving frameworks to demonstrate your methodical approach to challenges. A successful candidate is often one who can show a balance between independent initiative and the ability to follow established organizational protocols. Your professional narrative should reflect a trajectory of steady growth and increased responsibility."
    ]
};

const phraseScrambler = (points) => {
    const starters = [
        "Individuals in this role will be expected to",
        "The primary focus involves the ability to",
        "Successful candidates will demonstrate a capacity to",
        "Key duties include the requirement to",
        "A fundamental aspect of the position is to",
        "The team relies on the professional's ability to",
        "Core expectations center around the need to"
    ];
    return points.map((p, i) => {
        const cleanPoint = p.replace(/^[•\-\*\d\.\s]+/, '').trim();
        const starter = starters[i % starters.length];
        return `<li><strong>${starter}:</strong> ${cleanPoint}</li>`;
    }).join("");
};

const rewriteJobDescription = async (originalDescription, jobTitle, company) => {
    try {
        console.log(`Generating Manual Content: ${jobTitle} at ${company}`);

        // 1. Extract specific information (if any available from original)
        // This expects the scraper to have passed cleaner bits, but we handle raw too
        const findBullets = (text) => {
            let matches = text.match(/<li>(.*?)<\/li>/gi) || text.match(/[•\-\*]\s*(.*?)(?=\n|<br|$)/gi) || [];
            if (matches.length === 0 && text.length > 30) {
                // Fallback: Split by sentences or breaks if no explicit HTML bullets
                matches = text.split(/[.!?\n]\s*/).filter(s => s.trim().length > 15).slice(0, 15);
            }
            return matches.map(m => m.replace(/<\/?[^>]+(>|$)/g, "").replace(/^[•\-\*\s]+/, "").trim()).filter(m => m.length > 5);
        };

        const allBullets = findBullets(originalDescription);
        const responsibilities = allBullets.slice(0, 7);
        const qualifications = allBullets.slice(7, 14);

        // 2. Select Templates
        const randomAbout = templates.about[Math.floor(Math.random() * templates.about.length)];
        const randomGrowth = templates.growth[Math.floor(Math.random() * templates.growth.length)];
        const randomInsights = templates.insights[Math.floor(Math.random() * templates.insights.length)];
        const extraInsights = templates.insights[(Math.floor(Math.random() * templates.insights.length) + 1) % templates.insights.length];
        const randomTips = templates.tips[Math.floor(Math.random() * templates.tips.length)];

        // 3. Construct Sections
        const section1 = `<h3>About This Role</h3><p>${randomAbout}</p>`;

        const respList = responsibilities.length >= 5 ? phraseScrambler(responsibilities) :
            phraseScrambler(["Collaborate with cross-functional teams to deliver high-quality results.", "Analyze complex requirements and translate them into actionable tasks.", "Maintain high standards of documentation and process integrity.", "Support ongoing project initiatives through proactive communication.", "Identify and implement process improvements for increased efficiency."]);
        const section2 = `<h3>Key Responsibilities</h3><ul>${respList}</ul>`;

        const qualList = qualifications.length >= 5 ? phraseScrambler(qualifications) :
            phraseScrambler(["Relevant educational background or equivalent professional experience.", "Demonstrated history of success in similar high-performance roles.", "Excellent communication and interpersonal relationship skills.", "Proven ability to manage multiple priorities in a fast-paced environment.", "Strong analytical and problem-solving capabilities."]);
        const section3 = `<h3>Required Qualifications</h3><ul>${qualList}</ul>`;

        const section4 = `<h3>Work Environment & Growth</h3><p>${randomGrowth}</p>`;

        const section5 = `<h3>Industry Perspectives & Success Strategy</h3><p>${randomInsights}</p><p>${extraInsights}</p>`;

        const section6 = `<h3>Success Strategy & Interview Tips</h3><p>${randomTips}</p>`;

        // 4. Attribution
        const attribution = `<div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-left: 4px solid #007bff; font-style: italic;">
            This job listing is sourced from publicly available job postings. Please verify full details on the official employer website.
        </div>`;

        // Assemble
        const fullContent = `
            ${section1}
            ${section2}
            ${section3}
            ${section4}
            ${section5}
            ${section6}
            ${attribution}
        `;

        return fullContent;

    } catch (error) {
        console.error("Manual Content Generation Failed:", error);
        return originalDescription;
    }
};

// No longer need simpleRewrite/fallback as logic is merged above
const simpleRewrite = null;

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

const scrapeAndPostJobs = async (db, targetUrl) => {
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

            const url = targetUrl;

            console.log(`Scraping URL: ${url}`);

            // Navigate with simple waiter
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

            // Initial stabilization
            await new Promise(r => setTimeout(r, 5000));

            // Check for Cloudflare/Bot detection
            let title = await page.title();
            console.log(`Page Title: ${title}`);

            if (title.includes("Just a moment") || title.includes("Security Challenge")) {
                console.log("Detected Cloudflare check. Waiting 20s for verification to complete...");
                await new Promise(r => setTimeout(r, 20000));

                // Refresh title after wait
                title = await page.title();
                console.log(`Page Title after wait: ${title}`);
            }

            const bodyText = await page.evaluate(() => document.body.innerText).catch(() => "");
            if (bodyText.includes("Pardon Our Interruption") || title.includes("Human Verification") || title.includes("Just a moment")) {
                // Try one reload if blocked
                console.log("Still blocked. Attempting one reload...");
                await page.reload({ waitUntil: "domcontentloaded" });
                await new Promise(r => setTimeout(r, 10000));

                title = await page.title();
                if (title.includes("Just a moment")) {
                    throw new Error("Blocked by Glassdoor (Persistent)");
                }
            }

            // Gentle Scroll - Increased to find more jobs
            try {
                await page.evaluate(async () => {
                    for (let i = 0; i < 8; i++) { // Increased scroll iterations
                        window.scrollBy(0, 800);
                        await new Promise(resolve => setTimeout(resolve, 1000));
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
            });

            if (!rawJobs || rawJobs.length === 0) {
                console.warn("No jobs found. Possible selector mismatch or block.");
                throw new Error("No jobs found");
            }

            console.log(`Discovered ${rawJobs.length} potential jobs.`);
            // Process ALL discovered jobs instead of limiting to 15
            const jobsToProcess = rawJobs;

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

                    // Selective Scraper: Extract only important bullet points
                    const details = await detailPage.evaluate(() => {
                        const descriptionNode = document.querySelector("div[class*='jobDescription'], div[class*='desc'], .jobDescriptionContent");
                        if (!descriptionNode) return { description: "", employmentType: "Full-time", experienceLevel: "Mid-Level", salaryRange: null };

                        // Find all bullet points as "Important Information"
                        const bullets = Array.from(descriptionNode.querySelectorAll("li")).map(li => li.innerText.trim()).filter(t => t.length > 5);

                        return {
                            description: bullets.length > 0 ? bullets.join("\n") : (descriptionNode.innerText.length > 10 ? descriptionNode.innerText.substring(0, 2000) : ""), // Pass text if no bullets
                            employmentType: document.querySelector("div[class*='employment'], span[class*='type']")?.innerText || "Full-time",
                            experienceLevel: document.querySelector("div[class*='experience'], span[class*='level']")?.innerText || "Mid-Level",
                            salaryRange: document.querySelector("div[class*='salary'], span[class*='salary']")?.innerText || null,
                            companyLogo: document.querySelector("img[class*='logo'], img[class*='avatar']")?.src || null
                        };
                    });

                    await detailPage.close();

                    // Generate description (Always generate if we have a job title)
                    console.log(`Generating Description for: ${job.jobTitle}`);
                    const manualDescription = await rewriteJobDescription(details.description || "", job.jobTitle, job.companyName);

                    // Finalize the description
                    finalJob.description = manualDescription;

                    const { seoJobTitle } = transformDescription(
                        finalJob.description, job.jobTitle, job.jobLocation, job.companyName,
                        details.employmentType, details.experienceLevel, details.salaryRange, []
                    );
                    finalJob.jobTitle = seoJobTitle;

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

                // Rate Limit Prevention: Reduced to 2s for basic politeness since we are no longer using Gemini API
                console.log("Pacing: Waiting 2 seconds...");
                await new Promise(resolve => setTimeout(resolve, 2000));
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
                        to: subscriberEmails.join(", "), // Join to send to all Bcc or multiple To
                        subject: `New Job Alert: ${sampleJob.jobTitle}`,
                        html: `<h3>New Opportunities Discovered</h3>
                               <p><strong>${sampleJob.jobTitle}</strong> at <strong>${sampleJob.companyName}</strong></p>
                               <p>We've just listed new high-quality job opportunities matched to your preferences.</p>
                               <a href="https://jobnirvana.netlify.app/job/${sampleJob.slug}" style="padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">View Job Details</a>`
                    };
                    try {
                        await transporter.sendMail(mailOptions);
                        console.log(`Email alerts sent to ${subscriberEmails.length} subscribers.`);
                    } catch (e) {
                        console.error("Failed to send email alerts:", e.message);
                    }
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
