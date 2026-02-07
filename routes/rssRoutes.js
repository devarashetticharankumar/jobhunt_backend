const express = require("express");
const builder = require("xmlbuilder");
const rssRouter = express.Router();

rssRouter.get("/rss.xml", async (req, res) => {
    try {
        const db = req.app.locals.db;
        const baseUrl = "https://jobnirvana.netlify.app";

        if (!db) {
            console.error("Database connection not found in app.locals");
            return res.status(503).send("Database not connected");
        }

        // Fetch the latest 50 jobs
        const jobs = await db.collection("demoJobs")
            .find({})
            .project({ jobTitle: 1, companyName: 1, description: 1, createdAt: 1, slug: 1, _id: 1 })
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        // Create RSS XML
        const rss = builder.create("rss", { encoding: "UTF-8" })
            .att("version", "2.0")
            .att("xmlns:atom", "http://www.w3.org/2005/Atom")
            .ele("channel")
            .ele("title", "JobNirvana Jobs").up()
            .ele("link", baseUrl).up()
            .ele("description", "Latest job postings from JobNirvana").up()
            .ele("language", "en-us").up()
            .ele("lastBuildDate", new Date().toUTCString()).up()
            .ele("atom:link", { href: `${baseUrl}/rss.xml`, rel: "self", type: "application/rss+xml" }).up();

        jobs.forEach(job => {
            const jobUrl = `${baseUrl}/job/${job.slug || job._id}`;
            const pubDate = job.createdAt ? new Date(job.createdAt).toUTCString() : new Date().toUTCString();

            const item = rss.ele("item");
            item.ele("title", `${job.jobTitle} at ${job.companyName}`).up();
            item.ele("link", jobUrl).up();
            item.ele("guid", { isPermaLink: "true" }, jobUrl).up();

            // Simple description - could be enhanced with HTML sanitization if needed
            item.ele("description", job.description || "").up();
            item.ele("pubDate", pubDate).up();
            item.up();
        });

        res.header("Content-Type", "application/xml");
        res.send(rss.end({ pretty: true }));
    } catch (error) {
        console.error("Error generating RSS feed:", error);
        res.status(500).send("Error generating RSS feed");
    }
});

module.exports = rssRouter;
