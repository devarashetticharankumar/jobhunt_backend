const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// Get reviews and aggregated stats for a company
router.get("/:companyName", async (req, res) => {
    const db = req.app.locals.db;
    const reviewsCollection = db.collection("reviews");
    const jobsCollection = db.collection("demoJobs");

    try {
        const { companyName } = req.params;
        const decodedName = decodeURIComponent(companyName);

        // Fetch reviews
        const reviews = await reviewsCollection.find({ companyName: decodedName }).sort({ createdAt: -1 }).toArray();

        // Calculate average rating
        let totalRating = 0;
        reviews.forEach(r => totalRating += r.rating);
        const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        // Fetch active jobs for this company
        const jobs = await jobsCollection.find({ companyName: decodedName }).toArray();

        // Get basic company info from the most recent job posting (logo, description fallback)
        const companyInfo = jobs.length > 0 ? {
            logo: jobs[0].companyLogo,
            description: jobs[0].description // This assumes job description contains company info, usually it doesn't. 
            //Ideally we'd have a separate companies collection, but this works for MVP "Glassdoor-lite"
        } : {};

        res.json({
            companyName: decodedName,
            averageRating: avgRating,
            reviewCount: reviews.length,
            reviews: reviews,
            activeJobs: jobs,
            companyInfo
        });

    } catch (error) {
        console.error("Error fetching company details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Post a review
router.post("/", async (req, res) => {
    const db = req.app.locals.db;
    const reviewsCollection = db.collection("reviews");

    try {
        const { companyName, rating, reviewText, reviewerName, reviewerEmail } = req.body;

        const review = {
            companyName,
            rating: Number(rating),
            reviewText,
            reviewerName,
            reviewerEmail,
            createdAt: new Date()
        };

        const result = await reviewsCollection.insertOne(review);
        res.status(201).json({ message: "Review posted successfully!", reviewId: result.insertedId });

    } catch (error) {
        console.error("Error posting review:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
