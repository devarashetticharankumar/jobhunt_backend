const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { jobSchema } = require("../validation/schemas");
const validate = require("../validation/validate");
const { date } = require("joi");

// Post a job
router.post("/postjob", validate(jobSchema), async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const body = req.body;
    body.createdAt = new Date();
    const result = await jobCollections.insertOne(body);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

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

// Get jobs by email
router.get("/myJobs/:email", async (req, res) => {
  const db = req.app.locals.db;
  const jobCollections = db.collection("demoJobs");
  try {
    const jobs = await jobCollections
      .find({ postedBy: req.params.email })
      .toArray();
    res.send(jobs);
  } catch (error) {
    console.error("Error getting jobs by email:", error);
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
router.patch("/update-job/:id", async (req, res) => {
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
      res.send({ message: "Job updated successfully" });
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

module.exports = router;
