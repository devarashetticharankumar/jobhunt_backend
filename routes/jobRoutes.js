
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

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
//       text: `Hi there! A new job has been posted that might interest you: ${body.jobTitle}`,
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// Enhanced paraphrasing function without <ul> sections to avoid duplication
function paraphraseDescription(rawDescription, jobTitle, companyName) {
  // Ensure rawDescription is a string
  if (typeof rawDescription !== "string") {
    console.warn(
      "rawDescription is not a string, using fallback:",
      rawDescription
    );
    rawDescription = "";
  }

  // Sanitize input, preserving headings
  const plainText = sanitizeHtml(rawDescription, {
    allowedTags: ["h2", "h3"],
    allowedAttributes: {},
  });

  // Split into blocks (headings and non-headings)
  const blocks = plainText
    .split(/(<h[2-3][^>]*>.*?<\/h[2-3]>)/g)
    .filter((block) => block.trim().length > 0);

  let paraphrased = "";
  let currentHeading = null;

  // Process paragraphs and headings
  blocks.forEach((block, index) => {
    if (block.match(/<h[2-3][^>]*>.*?<\/h[2-3]>/)) {
      // Handle heading
      let headingText = sanitizeHtml(block, { allowedTags: [] }).trim();
      Object.keys(synonyms).forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "g");
        if (regex.test(headingText)) {
          const replacement =
            synonyms[word][Math.floor(Math.random() * synonyms[word].length)];
          headingText = headingText.replace(regex, replacement);
        }
      });
      const tagMatch = block.match(/<h([2-3])/);
      const tagLevel = tagMatch ? tagMatch[1] : "2";
      paraphrased += `<h${tagLevel}>${headingText}</h${tagLevel}>`;
      currentHeading = headingText;
    } else {
      // Handle non-heading content (sentences)
      const sentences = block
        .split(/[.!?]\s+|\n/)
        .filter((s) => s.trim().length > 0);
      sentences.forEach((sentence, sentIndex) => {
        let newSentence = sentence;
        Object.keys(synonyms).forEach((word) => {
          const regex = new RegExp(`\\b${word}\\b`, "g");
          if (regex.test(newSentence)) {
            const replacement =
              synonyms[word][Math.floor(Math.random() * synonyms[word].length)];
            newSentence = newSentence.replace(regex, replacement);
          }
        });
        if (
          newSentence.toLowerCase().includes("responsible") ||
          newSentence.toLowerCase().includes("tasked")
        ) {
          newSentence = `This ${jobTitle} role will ${newSentence
            .toLowerCase()
            .replace(/is responsible for|tasked with/gi, "tackle")}.`;
        }
        if (
          newSentence.toLowerCase().includes("work with") ||
          newSentence.toLowerCase().includes("collaborate")
        ) {
          newSentence = newSentence.replace(
            /work with|collaborate with/gi,
            "team up with"
          );
        }
        if (newSentence.toLowerCase().includes("manage")) {
          newSentence = newSentence.replace(
            /manage/gi,
            sentIndex % 3 === 0
              ? "orchestrate"
              : sentIndex % 3 === 1
              ? "steer"
              : "supervise"
          );
        }
        if (newSentence.toLowerCase().includes("lead")) {
          newSentence = newSentence.replace(
            /lead/gi,
            sentIndex % 2 === 0 ? "champion" : "drive"
          );
        }
        if (sentIndex % 2 === 0 && Math.random() > 0.4) {
          newSentence = `At ${companyName}, ${newSentence.toLowerCase()}.`;
        } else if (sentIndex % 3 === 0 && Math.random() > 0.5) {
          newSentence = `As a ${jobTitle}, you’ll ${newSentence.toLowerCase()}.`;
        }
        paraphrased += `<p>${newSentence}</p>`;
      });
    }
  });

  return (
    paraphrased ||
    `<p>Join ${companyName} as a ${jobTitle} to tackle exciting challenges!</p>`
  );
}

// Transform job description with all <ul> sections in "Your Role"
function transformDescription(
  rawDescription,
  jobTitle,
  jobLocation,
  companyName,
  employmentType,
  experienceLevel,
  salaryRange,
  scrapedSkills = []
) {
  // Sanitize for responsibilities extraction
  const allowedTags = ["p", "b", "strong", "ul", "li", "br", "h2", "h3", "h1"];
  const sanitizedDescription = sanitizeHtml(rawDescription, {
    allowedTags: allowedTags,
    allowedAttributes: {},
  });

  // Ensure sanitizedDescription is a string
  if (typeof sanitizedDescription !== "string") {
    console.warn(
      "sanitizedDescription is not a string, using fallback:",
      sanitizedDescription
    );
    sanitizedDescription = "";
  }

  // Extract bullet points for responsibilities
  let bulletPointsMatch = [];
  try {
    bulletPointsMatch = sanitizedDescription.match(/<ul>[\s\S]*?<\/ul>/g) || [];
  } catch (err) {
    console.warn("Regex failed for <ul> in transformDescription:", err.message);
  }

  let bulletPointsHtml =
    bulletPointsMatch.length > 0 ? bulletPointsMatch.join("") : "";
  let bulletItems = [];
  try {
    bulletItems = bulletPointsHtml.match(/<li>[\s\S]*?<\/li>/g) || [];
  } catch (err) {
    console.warn("Regex failed for <li> in transformDescription:", err.message);
  }

  // Paraphrase the raw description
  const paraphrasedDescription = paraphraseDescription(
    rawDescription,
    jobTitle,
    companyName
  );

  // Salary handling
  const salary =
    salaryRange && salaryRange !== "$50k–100k/year"
      ? salaryRange.replace(/₹/g, "$")
      : "Competitive Salary";
  const seoJobTitle = `${jobTitle} | ${companyName} | ${jobLocation} | ${salary}`;

  let minPrice = " ",
    maxPrice = "Competitive Salary";
  if (salaryRange) {
    const salaryMatch = salaryRange.match(
      /\$?(\d+[kT]?)\s*[–-]\s*\$?(\d+[kT]?)/i
    );
    if (salaryMatch) {
      minPrice = salaryMatch[1].replace("T", "k");
      maxPrice = salaryMatch[2].replace("T", "k");
    }
  }

  let transformed = `
    <h2><b>Launch Your ${jobTitle} Career with ${companyName} in ${jobLocation}!</b></h2>
    <p>Ready to elevate your career in ${jobLocation}? ${companyName} is seeking a passionate ${jobTitle} to join our innovative team in this vibrant tech hub. This ${employmentType.toLowerCase()} role offers ${salary.toLowerCase()}, exceptional benefits, and the chance to work on cutting-edge technology projects that shape the future of the industry. Whether you’re a seasoned ${jobTitle} or an ambitious professional eager to grow, this is your opportunity to make a real impact.</p><br>
    <p>Imagine yourself at ${companyName}, a leader in innovation and sustainability, where your skills as a ${jobTitle} will drive high-impact solutions. With ${salary}, top-tier perks, and a collaborative environment, this role is designed for those who thrive on challenges and want to advance their career in ${jobLocation}. <b>Apply now</b> to secure your spot!</p><br>

    <h2><b>About ${companyName}: Innovate with Purpose</b></h2>
    <p>At ${companyName}, we’re more than just a company—we’re a global force committed to excellence, sustainability, and transformative technology. As a ${jobTitle}, you’ll be at the forefront of groundbreaking initiatives, working with state-of-the-art tools and collaborating with industry experts. Our mission is to improve lives through innovation, and we need talented professionals like you to make it happen.</p>
    <p>Why choose ${companyName}? Because we offer a workplace where your ideas matter, your growth is prioritized, and your contributions shape the future. From ${jobLocation}, you’ll join a team that values diversity, creativity, and excellence. Curious about what’s in store? Keep reading to discover why this ${jobTitle} role is your next big career move.</p>

    <h2><b>📍 Why ${jobLocation}? A Perfect Blend of Work and Life</b></h2>
    <p>${jobLocation} isn’t just a job location—it’s a lifestyle destination. Known for its thriving tech community, stunning scenery, and unbeatable quality of life, this region is a magnet for professionals seeking career growth and personal fulfillment. As a ${jobTitle} at ${companyName}, you’ll enjoy a workplace that balances productivity with well-being.</p>
    <p>From modern office spaces to hybrid work options, ${jobLocation} offers flexibility that suits your needs. The area boasts a rich cultural scene, excellent schools, and endless recreational opportunities—perfect for professionals and families alike. Relocating? You’ll find a welcoming community ready to support your transition. <b>Learn more</b> about ${jobLocation} and see why it’s the ideal place to advance your ${jobTitle} career.</p>
    <ul style="margin: 0; padding-left: 20px; line-height: 1.2;">
      <li>✔ Thriving tech hub with endless collaboration opportunities</li>
      <li>✔ Scenic beauty and a balanced lifestyle</li>
      <li>✔ Flexible work options to fit your schedule</li>
    </ul>

    <h2><b>Job Description: What This ${jobTitle} Role Entails</b></h2>
    <p>Explore the core of this ${jobTitle} position at ${companyName}, reimagined to give you a fresh perspective on what’s involved:</p>
    <div>${paraphrasedDescription}</div>

    <h2><b>Your Role: Drive Impact as a ${jobTitle}</b></h2>
    <p>What does it mean to be a ${jobTitle} at ${companyName}? It’s about taking ownership, solving real-world problems, and delivering results that matter. This role is perfect for those who love a challenge and want to see their work make a difference. Here’s what you’ll be doing:</p>
    <ul style="margin: 0; padding-left: 20px; line-height: 1.2;">
  `;

  if (bulletItems.length > 0) {
    bulletItems.forEach((item) => {
      const bulletText = sanitizeHtml(item, { allowedTags: ["b", "strong"] })
        .replace(/<li>|<\/li>/g, "")
        .trim();
      transformed += `<li>✔ ${bulletText}</li>`;
    });
  } else {
    transformed += `
      <li>✔ Design and execute innovative projects that set industry benchmarks</li>
      <li>✔ Analyze data to uncover insights that drive strategic decisions</li>
      <li>✔ Collaborate with diverse teams to deliver top-quality solutions</li>
      <li>✔ Stay ahead with the latest trends and technologies in your field</li>
      <li>✔ Present ideas and results to stakeholders, shaping company direction</li>
      <li>✔ Optimize processes for efficiency and excellence</li>
      <li>✔ Mentor peers, fostering a culture of growth and innovation</li>
    `;
  }

  transformed +=
    `</ul><p>We value more than just skills—we want someone with curiosity, adaptability, and a passion for collaboration. If you’re eager to learn, propose bold ideas, and grow with ${companyName}, this ${jobTitle} role in ${jobLocation} is for you. <b>Show us what you’ve got—apply now!</b></p>` +
    `<h2><b>Why Join ${companyName}? Perks That Inspire</b></h2><p>Great talent deserves great rewards. At ${companyName}, we’ve crafted a benefits package to keep you motivated and supported:</p>` +
    `<ul style="margin: 0; padding-left: 20px; line-height: 1.2;"><li>💰 $${minPrice}–$${maxPrice}—a standout package for top performers</li><li>🎯 Performance Bonuses to celebrate your achievements</li><li>🏥 Comprehensive Health Plans—medical, dental, and vision</li><li>📈 Retirement Savings with company matching</li><li>🌿 Flexible Work Options—hybrid or remote where possible</li><li>📚 Learning Opportunities—courses, workshops, and more</li><li>🏖 Generous Paid Time Off to recharge</li><li>🎉 Team Events for connection and fun</li></ul>` +
    `<p>Our perks go beyond the basics. We offer career advancement, mentorship, and access to cutting-edge tools to fuel your growth as a ${jobTitle}. In ${jobLocation}, you’ll enjoy a workplace that prioritizes your well-being and success. <b>Ready to experience it? Apply today!</b></p>` +
    `<h2><b>Your Questions, Answered</b></h2><p>Got questions about this ${jobTitle} role? We’ve got you covered:</p>` +
    `<h3><b>❓ What’s the pay like?</b></h3><p>$${minPrice}–$${maxPrice}, plus bonuses tied to your performance and company milestones. It’s a package designed to reward your skills.</p>` +
    `<h3><b>❓ Can I work remotely?</b></h3><p>Yes, depending on the role and location. We offer hybrid and remote options to fit your life in ${jobLocation}.</p>` +
    `<h3><b>❓ What skills matter most?</b></h3><p>Technical prowess, teamwork, and communication are key for a ${jobTitle} at ${companyName}. Bring these, and you’ll thrive.</p>` +
    `<p>Still curious? Contact us during the application process for more details. <b>Don’t wait—apply now</b> to get started!</p>` +
    `<h2><b>Take Action: Join ${companyName} Today</b></h2><p>This ${jobTitle} role in ${jobLocation} is your chance to shine with ${companyName}. We’re building a team of innovators, and we want you on board. Don’t miss out—positions fill fast, and early applicants get priority. <b>Apply today</b> to kickstart your journey!</p>` +
    `<p>How to apply? Submit your resume and a cover letter via our portal. It’s quick, easy, and the first step to a rewarding career. <b>Act now</b>—your future at ${companyName} awaits!</p>` +
    `<h2><b>What Sets ${companyName} Apart</b></h2><p>${companyName} is more than a job—it’s a mission. We’re driven by innovation, inclusivity, and sustainability, and we’re looking for a ${jobTitle} to join us in ${jobLocation}.</p>` +
    `<ul style="margin: 0; padding-left: 20px; line-height: 1.2;"><li>🌍 Inclusive Culture: Diversity fuels our success</li><li>🔬 Cutting-Edge Projects: Shape the future</li><li>💡 Career Growth: Upskill and advance</li><li>🌱 Sustainability: Build a better tomorrow</li></ul>` +
    `<p>Our team in ${jobLocation} thrives on collaboration and creativity. Join us, and you’ll be part of a legacy of excellence and a future of possibility. <b>Apply now</b> to become a ${jobTitle} at ${companyName}!</p>` +
    `<p><b>Stay Connected:</b></p><ul style="margin: 0; padding-left: 20px; line-height: 1.2; display: flex"><li>🔹 ${companyName} Careers</li><li>🔹 LinkedIn</li><li>🔹 Glassdoor</li></ul>` +
    `<p>${companyName} is an Equal Opportunity Employer. We welcome all qualified ${jobTitle} candidates in ${jobLocation}, regardless of background. <b>Apply today—let’s innovate together!</b></p>`;

  return { description: transformed.trim(), seoJobTitle };
}

// Scrape and post jobs
async function scrapeAndPostJobs(db) {
  const jobCollections = db.collection("demoJobs");
  const subscriptionsCollection = db.collection("EmailSubscriptions");

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });
    await page.setDefaultNavigationTimeout(40000);

    const locationMap = { "United States": "IN1" };
    const locations = ["United States"];
    const scrapedJobs = [];

    for (const location of locations) {
      const countryCode = locationMap[location];
      // const url = `https://www.glassdoor.co.in/Job/${location
      //   .toLowerCase()
      //   .replace(
      //     / /g,
      //     "-"
      //   )}-usa-jobs-SRCH_IL.0,13_${countryCode}_KO14,17.htm?fromAge=1`;
      // console.log(`Scraping URL: ${url}`);

      const url = `https://www.glassdoor.co.in/Job/${location
        .toLowerCase()
        .replace(
          / /g,
          "-"
        )}-software-jobs-SRCH_IL.0,13_${countryCode}_KO14,22.htm?fromAge=1`;
      console.log(`Scraping URL: ${url}`);

      await page.goto(url, { waitUntil: "networkidle2", timeout: 40000 });
      await page.evaluate(async () => {
        for (let i = 0; i < 3; i++) {
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      });

      const rawJobs = await page.evaluate((loc) => {
        const jobElements = document.querySelectorAll(
          "li[class*='job'], li[class*='JobsList']"
        );
        console.log(`Found ${jobElements.length} job elements for ${loc}`);
        return Array.from(jobElements).map((job) => {
          const linkElement = job.querySelector("a[class*='title'], a");
          let companyNameRaw =
            job.querySelector(
              "div[class*='employer'], span[class*='employer'], div[class*='company'], span[class*='company']"
            )?.innerText || "Unknown";
          const companyName = companyNameRaw
            .replace(/\s+\d+(\.\d+)?\s*$/, "")
            .trim();
          return {
            glassdoorLink: linkElement?.href || "https://www.glassdoor.com",
            companyName: companyName,
            jobLocation:
              job.querySelector("div[class*='loc'], span[class*='loc']")
                ?.innerText || "Remote",
            jobTitle: linkElement?.innerText || "Untitled Job",
          };
        });
      }, location);

      const jobsWithDetails = [];
      for (const job of rawJobs) {
        const detailPage = await browser.newPage();
        await detailPage.goto(job.glassdoorLink, {
          waitUntil: "networkidle2",
          timeout: 40000,
        });

        let applyLink = null;
        try {
          const applyButtonSelector = "[data-test='applyButton']";
          const applyElement = await detailPage.$(applyButtonSelector);
          if (applyElement) {
            applyLink = await detailPage.evaluate((sel) => {
              const el = document.querySelector(sel);
              if (el.tagName === "A") return el.href;
              const parent = el.closest("div") || document;
              const nearbyLink = parent.querySelector(
                "a[href*='careers'], a[href*='jobs'], a[href*='apply']:not([href*='glassdoor'])"
              );
              return nearbyLink ? nearbyLink.href : null;
            }, applyButtonSelector);

            if (!applyLink) {
              const navigationPromise = detailPage.waitForNavigation({
                waitUntil: "networkidle2",
                timeout: 40000,
              });
              await detailPage.evaluate(
                (sel) => document.querySelector(sel)?.click(),
                applyButtonSelector
              );
              try {
                await navigationPromise;
                applyLink = detailPage.url();
              } catch (navError) {
                console.log(
                  `Navigation timeout for ${job.jobTitle}, using fallback: ${navError.message}`
                );
                applyLink =
                  (await detailPage.evaluate(() => {
                    const fallbackLink = document.querySelector(
                      "a[href*='careers'], a[href*='jobs'], a[href*='apply']:not([href*='glassdoor']):not([href*='overview'])"
                    );
                    return fallbackLink ? fallbackLink.href : null;
                  })) || job.glassdoorLink;
              }
            }

            if (!applyLink || applyLink.includes("glassdoor")) {
              applyLink =
                (await detailPage.evaluate(() => {
                  const fallbackLink = document.querySelector(
                    "a[href*='careers'], a[href*='jobs'], a[href*='apply']:not([href*='glassdoor']):not([href*='overview'])"
                  );
                  return fallbackLink ? fallbackLink.href : null;
                })) || job.glassdoorLink;
            }
          } else {
            applyLink = job.glassdoorLink;
          }
        } catch (err) {
          console.error(
            `Error extracting ApplyLink for ${job.jobTitle}: ${err.message}`
          );
          applyLink = job.glassdoorLink;
        }

        const details = await detailPage.evaluate(() => {
          const salaryText =
            document.querySelector(
              "div[class*='salary'], span[class*='salary']"
            )?.innerText || null;
          return {
            companyLogo:
              document.querySelector("img[class*='logo'], img[class*='avatar']")
                ?.src || "https://via.placeholder.com/150",
            description:
              document.querySelector(
                "div[class*='jobDescription'], div[class*='desc']"
              )?.innerHTML || "Job Details",
            employmentType:
              document.querySelector(
                "div[class*='employment'], span[class*='type']"
              )?.innerText || "Full-time",
            experienceLevel:
              document.querySelector(
                "div[class*='experience'], span[class*='level']"
              )?.innerText || "Mid-Level",
            salaryRange: salaryText,
            skills:
              document.querySelectorAll(
                "div[class*='skills'], span[class*='skill']"
              ).length > 0
                ? Array.from(
                    document.querySelectorAll(
                      "div[class*='skills'], span[class*='skill']"
                    )
                  ).map((skill) => ({ label: skill.innerText.trim() }))
                : [
                    { label: "Strong analytical skills" },
                    { label: "Proficiency in relevant tools" },
                    { label: "Excellent communication" },
                  ],
          };
        });

        const { description, seoJobTitle } = transformDescription(
          details.description,
          job.jobTitle,
          job.jobLocation,
          job.companyName,
          details.employmentType,
          details.experienceLevel,
          details.salaryRange,
          details.skills
        );

        let minPrice, maxPrice, salaryType;
        if (details.salaryRange) {
          const salaryMatch = details.salaryRange.match(
            /\$?(\d+[kT]?)\s*[–-]\s*\$?(\d+[kT]?)/i
          );
          if (salaryMatch) {
            minPrice = salaryMatch[1].replace("T", "k");
            maxPrice = salaryMatch[2].replace("T", "k");
            salaryType = details.salaryRange.toLowerCase().includes("year")
              ? "Yearly"
              : "Yearly";
          } else {
            minPrice = " ";
            maxPrice = "Competitive Salary";
            salaryType = " ";
          }
        } else {
          minPrice = " ";
          maxPrice = "Competitive Salary";
          salaryType = " ";
        }

        jobsWithDetails.push({
          glassdoorLink: job.glassdoorLink,
          companyName: job.companyName,
          jobLocation: job.jobLocation,
          jobTitle: seoJobTitle,
          companyLogo: details.companyLogo,
          description: description,
          employmentType: details.employmentType,
          experienceLevel: details.experienceLevel,
          skills: details.skills,
          ApplyLink: applyLink,
          postedBy: "jobhunt2580@gmail.com",
          slug: `${(seoJobTitle || "job")
            .toLowerCase()
            .replace(/ /g, "-")}-${Date.now()}`,
          createdAt: new Date(),
          minPrice,
          maxPrice,
          salaryType,
        });

        await detailPage.close();
      }

      scrapedJobs.push(...jobsWithDetails);
      console.log(
        `All jobs from ${location} added to scrapedJobs:`,
        scrapedJobs.length
      );
    }

    const validatedJobs = [];
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const job of scrapedJobs) {
      const existingJob = await jobCollections.findOne({
        ApplyLink: job.ApplyLink,
      });
      if (existingJob) continue;

      const { error } = jobSchema.validate(job);
      if (error) {
        console.error(
          `Validation failed for job ${job.jobTitle}: ${error.message}`
        );
        continue;
      }
      validatedJobs.push(job);
    }

    if (validatedJobs.length > 0) {
      await jobCollections.insertMany(validatedJobs);
      console.log(`Inserted ${validatedJobs.length} new jobs into demoJobs`);

      const subscribers = await subscriptionsCollection.find({}).toArray();
      const subscriberEmails = subscribers.map(
        (subscriber) => subscriber.email
      );

      for (const job of validatedJobs) {
        let mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: subscriberEmails,
          subject: "New Job Posted from JobNirvana!",
          text: `Hi there! A new job has been posted: ${job.jobTitle}`,
          html: `
            <h1>New Job Opportunity: ${job.jobTitle}</h1>
            <h2>Company: ${job.companyName}</h2>
            <img src="${job.companyLogo}" alt="${job.companyName} Logo" style="max-width: 100%; height: auto;">
            <div>${job.description}</div>
            <p>Apply here: <a href="${job.ApplyLink}" target="_blank">Apply Now</a></p>
          `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent for ${job.jobTitle}`);
      }
    }

    const allRecentJobs = await jobCollections
      .find({ createdAt: { $gte: twentyFourHoursAgo } })
      .toArray();
    await browser.close();
    return allRecentJobs;
  } catch (error) {
    console.error("Error scraping jobs:", error);
    throw error;
  }
}

// Manual scraping route
router.get("/scrape-jobs", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const allRecentJobs = await scrapeAndPostJobs(db);
    res.json(allRecentJobs);
  } catch (error) {
    res.status(500).send({ message: "Scraping failed", error });
  }
});

// Schedule automation at 5:00 AM, 12:00 PM, and 6:00 PM UTC daily
cron.schedule("0 5 * * *", async () => {
  console.log(
    "Running scheduled job scraping at 5:00 AM UTC",
    new Date().toISOString()
  );
  const db = global.db;
  if (!db) {
    console.error("Database not initialized for scheduled task at 5:00 AM UTC");
    return;
  }
  try {
    await scrapeAndPostJobs(db);
    console.log("Scheduled scraping at 5:00 AM UTC completed successfully");
  } catch (error) {
    console.error("Scheduled scraping at 5:00 AM UTC failed:", error);
  }
});

cron.schedule("0 12 * * *", async () => {
  console.log(
    "Running scheduled job scraping at 12:00 PM UTC",
    new Date().toISOString()
  );
  const db = global.db;
  if (!db) {
    console.error(
      "Database not initialized for scheduled task at 12:00 PM UTC"
    );
    return;
  }
  try {
    await scrapeAndPostJobs(db);
    console.log("Scheduled scraping at 12:00 PM UTC completed successfully");
  } catch (error) {
    console.error("Scheduled scraping at 12:00 PM UTC failed:", error);
  }
});

cron.schedule("0 18 * * *", async () => {
  console.log(
    "Running scheduled job scraping at 6:00 PM UTC",
    new Date().toISOString()
  );
  const db = global.db;
  if (!db) {
    console.error("Database not initialized for scheduled task at 6:00 PM UTC");
    return;
  }
  try {
    await scrapeAndPostJobs(db);
    console.log("Scheduled scraping at 6:00 PM UTC completed successfully");
  } catch (error) {
    console.error("Scheduled scraping at 6:00 PM UTC failed:", error);
  }
});

// CRUD routes
router.post("/postjob", validate(jobSchema), async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  const subscriptionsCollection = db.collection("EmailSubscriptions");

  try {
    const body = req.body;
    body.createdAt = new Date();
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

router.get("/all-jobs", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const jobs = await jobCollections.find().toArray();
    const sortedJobPosts = jobs.sort((a, b) => b.createdAt - a.createdAt);
    res.send(sortedJobPosts);
  } catch (error) {
    console.error("Error getting all jobs:", error);
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
    const jobs = await jobCollections.find({ postedBy: email }).toArray();
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
