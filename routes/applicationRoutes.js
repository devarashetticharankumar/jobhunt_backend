const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for resume uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "uploads/resumes";
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Apply for a job
router.post("/apply", upload.single("resume"), async (req, res) => {
    const db = req.app.locals.db;
    const applicationsCollection = db.collection("jobApplications");

    try {
        const { jobId, jobTitle, companyName, applicantId, applicantName, applicantEmail, coverLetter, postedBy } = req.body;

        // Check if already applied
        const existing = await applicationsCollection.findOne({
            jobId: jobId,
            applicantEmail: applicantEmail
        });

        if (existing) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        const application = {
            jobId,
            jobTitle,
            companyName,
            postedBy, // Email of the recruiter
            applicantId,
            applicantName,
            applicantEmail,
            coverLetter,
            resumePath: req.file ? req.file.path : null, // Store local path for now, typically S3 in prod
            resumeOriginalName: req.file ? req.file.originalname : null,
            status: "applied", // applied, shortlisted, rejected, hired
            appliedAt: new Date(),
        };

        const result = await applicationsCollection.insertOne(application);
        res.status(201).json({ message: "Application submitted successfully!", applicationId: result.insertedId });
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get applicants for a specific job (Recruiter view)
router.get("/job/:jobId", async (req, res) => {
    const db = req.app.locals.db;
    const applicationsCollection = db.collection("jobApplications");

    try {
        const { jobId } = req.params;
        const applications = await applicationsCollection.find({ jobId: jobId }).toArray();
        res.json(applications);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update application status
router.patch("/status/:id", async (req, res) => {
    const db = req.app.locals.db;
    const applicationsCollection = db.collection("jobApplications");

    try {
        const { id } = req.params;
        const { status } = req.body; // shortlisted, rejected

        const result = await applicationsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json({ message: `Applicant marked as ${status}` });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get my applications (Candidate view)
router.get("/my-applications/:email", async (req, res) => {
    const db = req.app.locals.db;
    const applicationsCollection = db.collection("jobApplications");

    try {
        const { email } = req.params;
        const applications = await applicationsCollection.find({ applicantEmail: email }).sort({ appliedAt: -1 }).toArray();
        res.json(applications);
    } catch (error) {
        console.error("Error fetching my applications:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
