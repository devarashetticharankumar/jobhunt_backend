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
const { checkJwt } = require("../middleware/auth");
const { jobSchema } = require("../validation/schemas");
const validate = require("../validation/validate");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const slugify = require("slugify");


// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// CRUD routes
router.post("/postjob", checkJwt, validate(jobSchema), async (req, res) => {
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

    console.log("Saving job to database...");
    const result = await jobCollections.insertOne(body);
    console.log("Job saved successfully:", result.insertedId);

    // Send email notification (Decoupled from main response)
    (async () => {
      try {
        console.log("Fetching subscribers for email notification...");
        const subscribers = await subscriptionsCollection.find({}).toArray();
        const subscriberEmails = subscribers.map((subscriber) => subscriber.email);

        if (subscriberEmails.length > 0) {
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

          console.log("Sending emails to", subscriberEmails.length, "subscribers...");
          await transporter.sendMail(mailOptions);
          console.log("Email notification sent successfully");
        } else {
          console.log("No subscribers found, skipping email notification");
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    })();

    res.status(200).send(result);
  } catch (error) {
    console.error("Critical error in /postjob route:", error);
    res.status(500).send({ message: "Server error", error: error.message || error });
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
            skills: { $ifNull: ["$skills", []] },
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
              skills: { $ifNull: ["$skills", []] },
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
            skills: { $ifNull: ["$skills", []] },
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

router.delete("/job/:id", checkJwt, async (req, res) => {
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

router.patch("/update-job/:id", checkJwt, validate(jobSchema), async (req, res) => {
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


// Click-tracking redirect
router.get("/redirect/:id", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  const { id } = req.params;

  try {
    console.log(`Redirect attempt for ID: ${id}`);
    const result = await jobCollections.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { clicks: 1 } },
      { returnDocument: "after" }
    );

    // MongoDB Node driver v6 findOneAndUpdate returns the document directly
    const job = result;

    if (job && (job.originalUrl || job.ApplyLink)) {
      let targetUrl = job.originalUrl || job.ApplyLink;
      console.log(`Found job: ${job.jobTitle}, redirecting to: ${targetUrl}`);

      // Ensure URL has a protocol
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }

      res.redirect(targetUrl);
    } else {
      console.warn(`Job or redirect URL not found for ID: ${id}`);
      res.status(404).send("Job or redirect URL not found");
    }
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Admin Aggregator Routes
const { runFetcher } = require("../cron/jobFetcher");

const logger = require("../utils/logger");

const isAdmin = (req, res, next) => {
  // Whitelist based on specific Auth0 sub ID or email claim
  const userEmail = req.auth?.email || req.auth?.["https://jobnirvana.com/email"];
  const sub = req.auth?.sub;

  const adminSub = "auth0|66fbe97960151320ca7d7f3b";
  const adminEmail = "jobhunt2580@gmail.com";

  if (req.auth && (sub === adminSub || userEmail === adminEmail)) {
    next();
  } else {
    logger.warn("Admin access denied for: %s", userEmail || sub);
    res.status(403).json({ message: "Admin access required" });
  }
};

router.get("/admin/aggregator/stats", checkJwt, isAdmin, async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const stats = await jobCollections.aggregate([
      { $match: { source: { $exists: true } } },
      { $group: { _id: "$source", count: { $sum: 1 } } }
    ]).toArray();

    const totalJobs = await jobCollections.countDocuments({});
    const aggregatedJobs = stats.reduce((acc, curr) => acc + curr.count, 0);

    res.json({
      totalJobs,
      aggregatedJobs,
      bySource: stats
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
});

router.post("/admin/aggregator/trigger", checkJwt, isAdmin, async (req, res) => {
  const db = req.app.locals.db;
  try {
    // Run in background
    runFetcher(db);
    res.json({ message: "Aggregator triggered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error triggering aggregator", error: error.message });
  }
});

router.post("/admin/aggregator/cleanup", checkJwt, isAdmin, async (req, res) => {
  const db = req.app.locals.db;
  try {
    const result = await db.collection("demoJobs").deleteMany({
      expiresAt: { $lt: new Date() }
    });
    res.json({ message: `Cleanup complete. Deleted ${result.deletedCount} expired jobs.` });
  } catch (error) {
    res.status(500).json({ message: "Error running cleanup", error: error.message });
  }
});

module.exports = router;
