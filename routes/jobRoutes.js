// const express = require("express");
// const { ObjectId } = require("mongodb");
// const router = express.Router();




// const { jobSchema } = require("../validation/schemas");
// const validate = require("../validation/validate");
// // const { sendEmailNotification } = require("../services/emailService");
// const nodemailer = require("nodemailer");

// // Nodemailer transporter setup
// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });
// /////////////////////////////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////////////////////////

// // Modified /postjob route with email notification
// router.post("/postjob", validate(jobSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   const subscriptionsCollection = db.collection("EmailSubscriptions");

//   try {
//     const body = req.body;
//     body.createdAt = new Date();

//     // Insert job into the database
//     const result = await jobCollections.insertOne(body);

//     // Retrieve all subscribed emails
//     const subscribers = await subscriptionsCollection.find({}).toArray();
//     const subscriberEmails = subscribers.map((subscriber) => subscriber.email);

//     // Define email options
//     let mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: subscriberEmails,
//       subject: "New Job Posted!",
//       text: `Hi there! A new job has been posted that might interest you: ${ body.jobTitle } `,
//       html: `
//         <h1>New Job Opportunity: ${body.jobTitle}</h1>
//         <h2>Company: ${body.companyName}</h2>
//         <img src="${body.companyLogo}" alt="${body.companyName} Logo" style="max-width: 100%; height: auto;">
//         <p>${body.description}</p>
//         <p>For more details, visit our website at <a href="https://jobnirvana.netlify.app/job/${result.insertedId}" target="_blank">JobNirvana</a>.</p>
//       `,
//     };

//     // Send email with defined transport object
//     try {
//       await transporter.sendMail(mailOptions);
//       console.log("Email sent");
//     } catch (emailError) {
//       console.error("Error sending email:", emailError);
//       return res
//         .status(500)
//         .send({ message: "Failed to send email", error: emailError });
//     }

//     res.status(200).send(result);
//   } catch (error) {
//     console.error("Error posting job:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////////

// // Get all jobs
// router.get("/all-jobs", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     createdAt = new Date();
//     const jobs = await jobCollections.find().toArray();
//     const sortedJobPosts = jobs.sort((a, b) => b.createdAt - a.createdAt);
//     res.send(sortedJobPosts);
//   } catch (error) {
//     console.error("Error getting all jobs:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Get all jobs with pagination
// // router.get("/all-jobs", async (req, res) => {
// //   const db = req.app.locals.db;
// //   const jobCollections = db.collection("demoJobs");

// //   try {
// //     // Get pagination parameters from query string, default values if not provided
// //     const page = parseInt(req.query.page) || 1;
// //     const limit = parseInt(req.query.limit) || 10; // Default limit to 10 jobs per page
// //     const skip = (page - 1) * limit;

// //     // Fetch jobs with pagination
// //     const jobs = await jobCollections.find().skip(skip).limit(limit).toArray();

// //     // Get total job count for pagination metadata
// //     const totalJobs = await jobCollections.countDocuments();

// //     // Sort the jobs by creation date
// //     const sortedJobPosts = jobs.sort((a, b) => b.createdAt - a.createdAt);

// //     // Send response with job data and pagination info
// //     res.send({
// //       jobs: sortedJobPosts,
// //       pagination: {
// //         currentPage: page,
// //         totalPages: Math.ceil(totalJobs / limit),
// //         totalJobs: totalJobs,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error getting all jobs:", error);
// //     res.status(500).send({ message: "Server error", error });
// //   }
// // });

// // Get single job by ID
// router.get("/all-jobs/:id", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const id = req.params.id;
//     const job = await jobCollections.findOne({ _id: new ObjectId(id) });
//     if (job) {
//       res.send(job);
//     } else {
//       res.status(404).send({ message: "Job not found" });
//     }
//   } catch (error) {
//     console.error("Error getting job:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Route to fetch jobs posted by a specific email
// router.get("/myJobs/:email", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");

//   try {
//     const { email } = req.params;
//     const jobs = await jobCollections.find({ postedBy: email }).toArray();
//     res.status(200).send(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Delete a job
// router.delete("/job/:id", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const id = req.params.id;
//     const result = await jobCollections.deleteOne({ _id: new ObjectId(id) });
//     if (result.deletedCount === 1) {
//       res.send({ message: "Job deleted successfully" });
//     } else {
//       res.status(404).send({ message: "Job not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting job:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Update a job
// // router.patch("/update-job/:id", validate(jobSchema), async (req, res) => {
// //   const db = req.app.locals.db;
// //   const jobCollections = db.collection("demoJobs");
// //   try {
// //     const id = req.params.id;
// //     const jobData = req.body;
// //     const result = await jobCollections.updateOne(
// //       { _id: new ObjectId(id) },
// //       { $set: jobData },
// //       { upsert: true }
// //     );

// //     if (result.matchedCount === 1) {
// //       res.send({ acknowledged: true, message: "Job updated successfully" });
// //     } else {
// //       res.status(404).send({ acknowledged: false, message: "Job not found" });
// //     }
// //   } catch (error) {
// //     console.error("Error updating job:", error);
// //     res
// //       .status(500)
// //       .send({ acknowledged: false, message: "Server error", error });
// //   }
// // });
// router.patch("/update-job/:id", validate(jobSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const id = req.params.id;
//     const jobData = req.body;

//     console.log("Updating job with ID:", id); // Log ID for debugging
//     const result = await jobCollections.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: jobData },
//       { upsert: true }
//     );

//     if (result.matchedCount === 1) {
//       res.send({ acknowledged: true, message: "Job updated successfully" });
//     } else {
//       res.status(404).send({ acknowledged: false, message: "Job not found" });
//     }
//   } catch (error) {
//     console.error("Error updating job:", error);
//     res
//       .status(500)
//       .send({ acknowledged: false, message: "Server error", error });
//   }
// });

// module.exports = router;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { jobSchema } = require("../validation/schemas");
const validate = require("../validation/validate");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cron = require("node-cron");
const sanitizeHtml = require("sanitize-html");
const slugify = require("slugify");

puppeteer.use(StealthPlugin());

// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Expanded synonyms map
const synonyms = {
  // General verbs
  develop: [
    "create",
    "build",
    "design",
    "formulate",
    "engineer",
    "construct",
    "devise",
    "innovate",
  ],
  manage: [
    "oversee",
    "direct",
    "coordinate",
    "supervise",
    "administer",
    "govern",
    "orchestrate",
    "handle",
  ],
  lead: [
    "guide",
    "direct",
    "spearhead",
    "champion",
    "steer",
    "pioneer",
    "drive",
    "head",
  ],
  ensure: [
    "guarantee",
    "uphold",
    "maintain",
    "secure",
    "confirm",
    "assure",
    "safeguard",
    "verify",
  ],
  work: [
    "collaborate",
    "engage",
    "partner",
    "contribute",
    "cooperate",
    "participate",
    "team up",
    "align",
  ],
  implement: [
    "execute",
    "deploy",
    "roll out",
    "realize",
    "apply",
    "enact",
    "deliver",
    "operationalize",
  ],
  deliver: [
    "provide",
    "supply",
    "achieve",
    "complete",
    "fulfill",
    "produce",
    "present",
    "accomplish",
  ],
  support: [
    "aid",
    "assist",
    "bolster",
    "facilitate",
    "promote",
    "enable",
    "back",
    "strengthen",
  ],
  responsible: [
    "tasked with",
    "accountable for",
    "in charge of",
    "leading",
    "entrusted with",
    "overseeing",
    "managing",
    "directing",
  ],
  grow: [
    "expand",
    "advance",
    "evolve",
    "develop",
    "progress",
    "mature",
    "scale",
    "enhance",
  ],
  improve: [
    "enhance",
    "refine",
    "optimize",
    "upgrade",
    "boost",
    "elevate",
    "strengthen",
    "polish",
  ],
  evaluate: [
    "assess",
    "analyze",
    "review",
    "appraise",
    "examine",
    "scrutinize",
    "judge",
    "consider",
  ],

  // General nouns
  team: [
    "group",
    "crew",
    "unit",
    "colleagues",
    "squad",
    "staff",
    "workforce",
    "associates",
  ],
  project: [
    "initiative",
    "endeavor",
    "assignment",
    "venture",
    "task",
    "undertaking",
    "effort",
    "mission",
  ],
  client: [
    "customer",
    "partner",
    "stakeholder",
    "business",
    "patron",
    "consumer",
    "collaborator",
    "recipient",
  ],
  requirements: [
    "needs",
    "specifications",
    "criteria",
    "expectations",
    "prerequisites",
    "standards",
    "demands",
    "guidelines",
  ],
  skills: [
    "expertise",
    "abilities",
    "competencies",
    "proficiencies",
    "talents",
    "capabilities",
    "know-how",
    "aptitudes",
  ],
  experience: [
    "background",
    "practice",
    "exposure",
    "knowledge",
    "expertise",
    "track record",
    "familiarity",
    "history",
  ],
  opportunity: [
    "chance",
    "possibility",
    "prospect",
    "opening",
    "avenue",
    "potential",
    "scope",
    "break",
  ],
  solution: [
    "answer",
    "resolution",
    "approach",
    "fix",
    "strategy",
    "method",
    "system",
    "remedy",
  ],
  business: [
    "company",
    "firm",
    "enterprise",
    "organization",
    "operation",
    "venture",
    "entity",
    "corporation",
  ],

  // Product Owner-specific terms
  "product owner": [
    "product lead",
    "solution manager",
    "feature owner",
    "product strategist",
    "vision coordinator",
    "delivery lead",
    "backlog manager",
  ],
  "user stories": [
    "feature narratives",
    "use cases",
    "requirements specs",
    "task descriptions",
    "functional stories",
    "epic outlines",
    "acceptance criteria",
  ],
  "sprint planning": [
    "iteration planning",
    "cycle coordination",
    "agile prep",
    "release scheduling",
    "task prioritization",
    "sprint organization",
    "delivery mapping",
  ],
  stakeholder: [
    "key contact",
    "business partner",
    "decision-maker",
    "collaborator",
    "sponsor",
    "client representative",
    "executive",
    "influencer",
  ],
  roadmap: [
    "plan",
    "strategy",
    "blueprint",
    "timeline",
    "vision",
    "pathway",
    "priority map",
    "development schedule",
  ],
  agile: [
    "iterative",
    "flexible",
    "scrum-based",
    "adaptive",
    "incremental",
    "dynamic",
    "lean",
    "responsive",
  ],
  backlog: [
    "priority list",
    "task queue",
    "feature pipeline",
    "work inventory",
    "delivery stack",
    "requirement pool",
    "iteration log",
  ],
  prioritization: [
    "ranking",
    "ordering",
    "sequencing",
    "weighting",
    "sorting",
    "importance setting",
    "value alignment",
  ],

  // Software and talent management terms
  "software applications": [
    "digital solutions",
    "tech platforms",
    "app systems",
    "software tools",
    "technology products",
    "application suites",
    "custom programs",
    "IT solutions",
  ],
  "talent management": [
    "workforce development",
    "human capital strategy",
    "employee growth",
    "personnel optimization",
    "team enhancement",
    "HR solutions",
    "people management",
  ],
  enterprise: [
    "large-scale",
    "corporate",
    "organization-wide",
    "business-level",
    "company-wide",
    "global",
    "institutional",
    "major",
  ],
  deployment: [
    "rollout",
    "launch",
    "implementation",
    "release",
    "activation",
    "delivery",
    "go-live",
    "installation",
  ],
  design: [
    "creation",
    "development",
    "structuring",
    "planning",
    "formulation",
    "architecture",
    "blueprinting",
    "crafting",
  ],

  // Client and relationship terms
  relationship: [
    "partnership",
    "connection",
    "collaboration",
    "rapport",
    "alliance",
    "engagement",
    "bond",
    "association",
  ],
  engagement: [
    "involvement",
    "interaction",
    "participation",
    "collaboration",
    "commitment",
    "connection",
    "dialogue",
    "exchange",
  ],
  communication: [
    "interaction",
    "dialogue",
    "correspondence",
    "exchange",
    "discussion",
    "connection",
    "articulation",
    "messaging",
  ],

  // Benefits and culture terms
  benefits: [
    "perks",
    "advantages",
    "rewards",
    "incentives",
    "offerings",
    "provisions",
    "compensations",
    "extras",
  ],
  culture: [
    "environment",
    "ethos",
    "atmosphere",
    "values",
    "climate",
    "community",
    "spirit",
    "identity",
  ],
  health: [
    "well-being",
    "wellness",
    "fitness",
    "care",
    "vitality",
    "medical support",
    "healthcare",
    "life quality",
  ],
  inclusive: [
    "diverse",
    "welcoming",
    "open",
    "equitable",
    "accessible",
    "collaborative",
    "unified",
    "embracing",
  ],

  // Adjectives
  excellent: [
    "outstanding",
    "superb",
    "exceptional",
    "remarkable",
    "top-notch",
    "stellar",
    "impressive",
    "first-rate",
  ],
  strong: [
    "robust",
    "solid",
    "powerful",
    "firm",
    "resilient",
    "reliable",
    "capable",
    "steady",
  ],
  complex: [
    "intricate",
    "sophisticated",
    "detailed",
    "elaborate",
    "multifaceted",
    "challenging",
    "involved",
    "nuanced",
  ],
  innovative: [
    "creative",
    "groundbreaking",
    "cutting-edge",
    "novel",
    "original",
    "forward-thinking",
    "pioneering",
    "inventive",
  ],
};

// Enhanced paraphrasing function (fixed regex error)


// Scrape and post jobs


// Manual scraping route
// Manual scraping route
router.get("/scrape-jobs", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { scrapeAndPostJobs } = require("../services/jobScraperService");

    // Allow location override via query param for testing
    const location = req.query.location || "United States";
    console.log(`Manual scraping triggered for location: ${location}`);

    const allRecentJobs = await scrapeAndPostJobs(db, location);
    res.json(allRecentJobs);
  } catch (error) {
    console.error("Manual scraping error:", error);
    res.status(500).send({ message: "Scraping failed", error: error.message });
  }
});

// Schedule automation every 24 hours at midnight UTC


// CRUD routes
router.post("/postjob", validate(jobSchema), async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  const subscriptionsCollection = db.collection("EmailSubscriptions");

  try {
    const body = req.body;
    body.createdAt = new Date();

    // Generate slug
    if (body.jobTitle) {
      const baseSlug = slugify(body.jobTitle, { lower: true, strict: true });
      body.slug = `${baseSlug}-${new ObjectId().toString().slice(-6)}`;
    }

    const result = await jobCollections.insertOne(body);

    const subscribers = await subscriptionsCollection.find({}).toArray();
    const subscriberEmails = subscribers.map((subscriber) => subscriber.email);

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: subscriberEmails,
      subject: "New Job Posted!",
      text: `Hi there! A new job has been posted that might interest you: ${body.jobTitle}`,
      html: `
        <h1>New Job Opportunity: ${body.jobTitle}</h1>
        <h2>Company: ${body.companyName}</h2>
        <img src="${body.companyLogo}" alt="${body.companyName} Logo" style="max-width: 100%; height: auto;">
        <div>${body.description}</div>
        <p>For more details, visit our website at <a href="https://jobnirvana.netlify.app/job/${result.insertedId}" target="_blank">JobNirvana</a>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
    res.status(200).send(result);
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get recent jobs (optimized for Home Page)
router.get("/recent-jobs", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    // Aggregation to derive postingDate and limit fields
    const jobs = await jobCollections
      .aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 9 },
        {
          $project: {
            _id: 1,
            companyName: 1,
            companyLogo: 1,
            jobTitle: 1,
            jobLocation: 1,
            minPrice: 1,
            maxPrice: 1,
            salaryType: 1,
            employmentType: 1,
            postingDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            experienceLevel: 1,
            slug: 1,
            description: { $substrCP: [{ $ifNull: ["$description", ""] }, 0, 300] },
            createdAt: 1
          },
        },
      ])
      .toArray();
    res.send(jobs);
  } catch (error) {
    console.error("Error getting recent jobs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get all salaries (Lightweight endpoint for Salary Page)
router.get("/all-salaries", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const jobs = await jobCollections
      .aggregate([
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            jobTitle: 1,
            minPrice: 1,
            maxPrice: 1,
            salaryType: 1,
            experienceLevel: 1,
            slug: 1
          },
        },
      ])
      .toArray();
    res.send(jobs);
  } catch (error) {
    console.error("Error getting salaries:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get related jobs (Optimized)
router.get("/related-jobs/:id", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  const { id } = req.params;

  // Get query params for filtering
  const { location, level, type } = req.query;

  try {
    let query = {
      _id: { $ne: new ObjectId(id) }
    };

    // Construct OR query for relationship
    if (location || level || type) {
      query.$or = [];
      if (location) query.$or.push({ jobLocation: location });
      if (level) query.$or.push({ experienceLevel: level });
      if (type) query.$or.push({ employmentType: type });
    }

    const jobs = await jobCollections
      .aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $limit: 6 },
        {
          $project: {
            _id: 1,
            companyName: 1,
            companyLogo: 1,
            jobTitle: 1,
            slug: 1
          },
        },
      ])
      .toArray();
    res.send(jobs);
  } catch (error) {
    console.error("Error getting related jobs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get featured companies (Optimized aggregation)
router.get("/featured-companies", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const logos = await jobCollections
      .aggregate([
        { $match: { companyLogo: { $exists: true, $ne: null, $ne: "" } } },
        { $group: { _id: "$companyLogo" } }, // Group by logo to get unique ones
        { $limit: 6 }, // Limit to 6
        { $project: { _id: 0, logo: "$_id" } }
      ])
      .toArray();

    // Return array of strings
    res.send(logos.map(l => l.logo));
  } catch (error) {
    console.error("Error getting featured companies:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

router.get("/all-jobs", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12; // Adjusted limit for grid layout
  const skip = (page - 1) * limit;

  // Filters
  const search = req.query.search || "";
  const location = req.query.location || "";
  const filter = req.query.filter || ""; // The "category" filter (multi-purpose)

  try {
    const pipeline = [];
    const matchStage = {};

    // 1. Text Search (Job Title)
    if (search) {
      matchStage.jobTitle = { $regex: search, $options: "i" };
    }

    // 2. Location Filter (Direct)
    if (location) {
      matchStage.jobLocation = { $regex: location, $options: "i" };
    }

    // 3. Smart "Category" Filter
    if (filter) {
      const orConditions = [
        { jobLocation: { $regex: filter, $options: "i" } },
        { salaryType: { $regex: filter, $options: "i" } },
        { employmentType: { $regex: filter, $options: "i" } },
        { experienceLevel: { $regex: filter, $options: "i" } },
      ];

      // Check if filter is a date (YYYY-MM-DD)
      const isDate = /^\d{4}-\d{2}-\d{2}$/.test(filter);
      if (isDate) {
        // Assuming createdAt is used for postingDate logic on backend
        // Convert input date string to Date object for comparison?
        // Actually, frontend logic was: postingDate >= selectedCategory
        // But backend data `createdAt` is a Date object.
        // Let's filter jobs created AFTER or ON this date.
        orConditions.push({ createdAt: { $gte: new Date(filter) } });
      }

      // Check if filter is a number (Price)
      // Frontend logic: parseInt(maxPrice) <= parseInt(selectedCategory)
      const isNumber = !isNaN(parseFloat(filter)) && isFinite(filter);
      if (isNumber) {
        // We need to support string numbers in DB "100k" -> we usually just regex match or simple compare
        // But the requirement specifically asked for <= logic.
        // This is complex if DB stores strings like "100k".
        // For now, let's keep it simple and safe: Try to match strings primarily.
        // If we want numeric comparison, we need $toInt in aggregation, but that fails on non-numeric strings.
        // Fallback: simpler regex match for now OR exact string match.
        // Replicating frontend exact behavior requires cleaning data first.
        // We will add the logic essentially assuming cleaned data or just simple matching for now to unblock content.
        // orConditions.push({ maxPrice: { $lte: parseInt(filter) } }); // Checking if stored as number? likely string.
        // Let's rely on regex for consistency with "category" behavior unless verified otherwise.
        // OR filtering logic from frontend: parseInt(maxPrice) <= parseInt(selectedCategory)
        // If DB has "120", "20", etc as strings.
        // Let's try to simulate checking if maxPrice (converted) is <= filter.
        orConditions.push({
          $expr: {
            $lte: [{ $toInt: "$maxPrice" }, parseInt(filter)]
          }
        });
      }

      matchStage.$or = orConditions;
    }

    pipeline.push({ $match: matchStage });

    // 4. Sort (Newest First)
    pipeline.push({ $sort: { createdAt: -1 } });

    // 5. Facet for Pagination metadata + Results
    pipeline.push({
      $facet: {
        totalCount: [{ $count: "count" }],
        jobs: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              companyName: 1,
              companyLogo: 1,
              jobTitle: 1,
              jobLocation: 1,
              minPrice: 1,
              maxPrice: 1,
              salaryType: 1,
              employmentType: 1,
              postingDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              experienceLevel: 1,
              slug: 1,
              description: { $substrCP: [{ $ifNull: ["$description", ""] }, 0, 300] },
              createdAt: 1
            }
          }
        ]
      }
    });

    const results = await jobCollections.aggregate(pipeline).toArray();

    const totalJobs = results[0].totalCount[0] ? results[0].totalCount[0].count : 0;
    const totalPages = Math.ceil(totalJobs / limit);
    const jobs = results[0].jobs;

    res.send({
      totalJobs,
      totalPages,
      currentPage: page,
      jobs,
    });
  } catch (error) {
    console.error("Error getting all jobs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get job by slug
router.get("/job/:slug", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const slug = req.params.slug;
    const job = await jobCollections.findOne({ slug: slug });
    if (job) {
      res.send(job);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error getting job by slug:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

router.get("/all-jobs/:id", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const id = req.params.id;
    const job = await jobCollections.findOne({ _id: new ObjectId(id) });
    if (job) {
      res.send(job);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error getting job:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

router.get("/myJobs/:email", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const { email } = req.params;
    const jobs = await jobCollections
      .aggregate([
        { $match: { postedBy: email } },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            companyName: 1,
            companyLogo: 1,
            jobTitle: 1,
            jobLocation: 1,
            minPrice: 1,
            maxPrice: 1,
            salaryType: 1,
            employmentType: 1,
            experienceLevel: 1,
            postingDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            slug: 1,
            // Minimal description or none? Assuming table view doesn't need description.
            // If needed, truncate massively.
            // description: { $substrCP: [{ $ifNull: ["$description", ""] }, 0, 100] },
            createdAt: 1
          }
        }
      ])
      .toArray();
    res.status(200).send(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

router.delete("/job/:id", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const id = req.params.id;
    const result = await jobCollections.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.send({ message: "Job deleted successfully" });
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

router.patch("/update-job/:id", validate(jobSchema), async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const id = req.params.id;
    const jobData = req.body;
    const result = await jobCollections.updateOne(
      { _id: new ObjectId(id) },
      { $set: jobData },
      { upsert: true }
    );

    if (result.matchedCount === 1) {
      res.send({ acknowledged: true, message: "Job updated successfully" });
    } else {
      res.status(404).send({ acknowledged: false, message: "Job not found" });
    }
  } catch (error) {
    console.error("Error updating job:", error);
    res
      .status(500)
      .send({ acknowledged: false, message: "Server error", error });
  }
});

module.exports = router;
