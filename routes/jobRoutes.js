const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { jobSchema } = require("../validation/schemas");
const validate = require("../validation/validate");
// const { sendEmailNotification } = require("../services/emailService");
const nodemailer = require("nodemailer");

// Nodemailer transporter setup
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
/////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////

// Modified /postjob route with email notification
router.post("/postjob", validate(jobSchema), async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  const subscriptionsCollection = db.collection("EmailSubscriptions");

  try {
    const body = req.body;
    body.createdAt = new Date();

    // Insert job into the database
    const result = await jobCollections.insertOne(body);

    // Retrieve all subscribed emails
    const subscribers = await subscriptionsCollection.find({}).toArray();
    const subscriberEmails = subscribers.map((subscriber) => subscriber.email);

    // Define email options
    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: subscriberEmails,
      subject: "New Job Posted!",
      text: `Hi there! A new job has been posted that might interest you: ${body.jobTitle}`,
      html: `
        <h1>New Job Opportunity: ${body.jobTitle}</h1>
        <h2>Company: ${body.companyName}</h2>
        <img src="${body.companyLogo}" alt="${body.companyName} Logo" style="max-width: 100%; height: auto;">
        <p>${body.description}</p>
        <p>For more details, visit our website at <a href="https://jobnirvana.netlify.app/job/${result.insertedId}" target="_blank">JobNirvana</a>.</p>
      `,
    };

    // Send email with defined transport object
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res
        .status(500)
        .send({ message: "Failed to send email", error: emailError });
    }

    res.status(200).send(result);
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////

// Get all jobs
router.get("/all-jobs", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    createdAt = new Date();
    const jobs = await jobCollections.find().toArray();
    const sortedJobPosts = jobs.sort((a, b) => b.createdAt - a.createdAt);
    res.send(sortedJobPosts);
  } catch (error) {
    console.error("Error getting all jobs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get single job by ID
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

// Route to fetch jobs posted by a specific email
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

// Delete a job
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

// Update a job
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

//////////////////////////////////////////////////////////////////////////////
// this code is for slug generation and the code is working perfectly
//////////////////////////////////////////////////////////////////////////////////
// const express = require("express");
// const { ObjectId } = require("mongodb");
// const router = express.Router();
// const { jobSchema } = require("../validation/schemas");
// const validate = require("../validation/validate");
// const nodemailer = require("nodemailer");

// // Nodemailer transporter setup
// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Helper function to generate slug from job title
// const generateSlug = (title) => {
//   return title
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-") // Replace spaces or non-alphanumeric characters with hyphens
//     .replace(/^[-]+|[-]+$/g, ""); // Remove leading/trailing hyphens
// };

// // Create Job with Slug Generation
// router.post("/postjob", validate(jobSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   const subscriptionsCollection = db.collection("EmailSubscriptions");

//   try {
//     const body = req.body;
//     body.createdAt = new Date();
//     body.slug = generateSlug(body.jobTitle); // Generate slug from job title

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
//         <p>For more details, visit our website at <a href="https://jobnirvana.netlify.app/job/${result.insertedId}/${body.slug}" target="_blank">JobNirvana</a>.</p>
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

// // Get all jobs
// router.get("/all-jobs", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const jobs = await jobCollections.find().toArray();
//     const sortedJobPosts = jobs.sort((a, b) => b.createdAt - a.createdAt);
//     res.send(sortedJobPosts);
//   } catch (error) {
//     console.error("Error getting all jobs:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Get single job by ID (Added this route)
// router.get("/all-jobs/id/:id", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const jobId = req.params.id;
//     const job = await jobCollections.findOne({ _id: new ObjectId(jobId) });
//     if (job) {
//       res.send(job);
//     } else {
//       res.status(404).send({ message: "Job not found" });
//     }
//   } catch (error) {
//     console.error("Error getting job by ID:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Get single job by slug (already exists)
// router.get("/all-jobs/:slug", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const slug = req.params.slug;
//     const job = await jobCollections.findOne({ slug: slug });
//     if (job) {
//       res.send(job);
//     } else {
//       res.status(404).send({ message: "Job not found" });
//     }
//   } catch (error) {
//     console.error("Error getting job by slug:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Get single job by ID or Slug (Handles both)
// // router.get("/all-jobs/:identifier", async (req, res) => {
// //   const db = req.app.locals.db;
// //   const jobCollections = db.collection("demoJobs");

// //   try {
// //     const identifier = req.params.identifier;

// //     // Check if the identifier is an ObjectId or slug
// //     let job;
// //     if (ObjectId.isValid(identifier)) {
// //       // If it's a valid ObjectId, fetch job by ID
// //       job = await jobCollections.findOne({ _id: new ObjectId(identifier) });
// //     } else {
// //       // If it's not an ObjectId, fetch job by slug
// //       job = await jobCollections.findOne({ slug: identifier });
// //     }

// //     if (job) {
// //       res.send(job);
// //     } else {
// //       res.status(404).send({ message: "Job not found" });
// //     }
// //   } catch (error) {
// //     console.error("Error getting job by ID or slug:", error);
// //     res.status(500).send({ message: "Server error", error });
// //   }
// // });

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

// // Delete a job by slug
// router.delete("/job/:slug", async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const slug = req.params.slug;
//     const result = await jobCollections.deleteOne({ slug: slug });
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

// // Update a job by slug
// router.patch("/update-job/:slug", validate(jobSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const jobCollections = db.collection("demoJobs");
//   try {
//     const slug = req.params.slug;
//     const jobData = req.body;

//     // Generate new slug if title is updated
//     if (jobData.jobTitle) {
//       jobData.slug = generateSlug(jobData.jobTitle);
//     }

//     const result = await jobCollections.updateOne(
//       { slug: slug },
//       { $set: jobData }
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
