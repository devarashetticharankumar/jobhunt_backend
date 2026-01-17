// const express = require("express");
// const builder = require("xmlbuilder");

// const sitemapRouter = express.Router();
// // const redirectToFrontendSitemap = true; // Set to true if you want to redirect requests for the sitemap
// sitemapRouter.get("/sitemap.xml", async (req, res) => {
//   // if (redirectToFrontendSitemap) {
//   //   // Redirect to the Netlify-hosted sitemap URL
//   //   const netlifySitemapUrl = "https://jobnirvana.netlify.app/sitemap.xml";
//   //   return res.redirect(netlifySitemapUrl);
//   // }
//   try {
//     const db = req.app.locals.db; // Use app.locals to access the database
//     const baseUrl = "https://jobnirvana.netlify.app";

//     // Fetch jobs and blogs from the database
//     const jobs = await db.collection("demoJobs").find().toArray();
//     const blogs = await db.collection("blogs").find().toArray();

//     // Create Sitemap XML
//     const sitemap = builder
//       .create("urlset", { encoding: "UTF-8" })
//       .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

//     // Add Static Pages
//     const staticPages = [
//       { url: "/", updatedAt: new Date().toISOString() },
//       { url: "/about-us", updatedAt: new Date().toISOString() },
//       { url: "/contact-us", updatedAt: new Date().toISOString() },
//       { url: "/salary", updatedAt: new Date().toISOString() },
//       { url: "/blogs", updatedAt: new Date().toISOString() },
//       { url: "/youtube-videos", updatedAt: new Date().toISOString() },
//     ];
//     staticPages.forEach((page) => {
//       sitemap
//         .ele("url")
//         .ele("loc", `${baseUrl}${page.url}`)
//         .up()
//         .ele("lastmod", page.updatedAt)
//         .up()
//         .ele("changefreq", "monthly")
//         .up()
//         .ele("priority", "1.0")
//         .up();
//     });

//     // Add Dynamic Job Pages
//     jobs.forEach((job) => {
//       sitemap
//         .ele("url")
//         .ele("loc", `${baseUrl}/job/${job._id}`)
//         .up()
//         .ele("lastmod", job.updatedAt || new Date().toISOString())
//         .up()
//         .ele("changefreq", "daily")
//         .up()
//         .ele("priority", "0.8")
//         .up();
//     });

//     // Add Dynamic Blog Pages
//     blogs.forEach((blog) => {
//       sitemap
//         .ele("url")
//         .ele("loc", `${baseUrl}/blog/${blog.slug}`)
//         .up()
//         .ele("lastmod", blog.updatedAt || new Date().toISOString())
//         .up()
//         .ele("changefreq", "daily")
//         .up()
//         .ele("priority", "0.8")
//         .up();
//     });

//     // Set Header and Send Response
//     res.header("Content-Type", "application/xml");
//     res.send(sitemap.end({ pretty: true }));
//   } catch (error) {
//     console.error("Error generating sitemap:", error);
//     res.status(500).send("Error generating sitemap");
//   }
// });

// module.exports = sitemapRouter;

const express = require("express");
const builder = require("xmlbuilder");

const sitemapRouter = express.Router();
sitemapRouter.get("/sitemap.xml", async (req, res) => {
  try {
    console.log("Generating sitemap...");
    const db = req.app.locals.db; // Use app.locals to access the database

    if (!db) {
      console.error("Database connection not found in app.locals");
      return res.status(500).send("Database not connected");
    }

    const baseUrl = "https://jobnirvana.netlify.app";

    // Fetch jobs and blogs from the database
    console.log("Fetching jobs from DB...");
    const jobs = await db.collection("demoJobs").find().toArray();
    console.log(`Fetched ${jobs.length} jobs.`);

    console.log("Fetching blogs from DB...");
    const blogs = await db.collection("blogs").find().toArray();
    console.log(`Fetched ${blogs.length} blogs.`);

    // Create Sitemap XML
    const sitemap = builder
      .create("urlset", { encoding: "UTF-8" })
      .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    // Add Static Pages
    const staticPages = [
      { url: "/", updatedAt: new Date().toISOString() },
      { url: "/jobs", updatedAt: new Date().toISOString() },
      { url: "/about-us", updatedAt: new Date().toISOString() },
      { url: "/contact-us", updatedAt: new Date().toISOString() },
      { url: "/salary", updatedAt: new Date().toISOString() },
      { url: "/blogs", updatedAt: new Date().toISOString() },
      { url: "/youtube-videos", updatedAt: new Date().toISOString() },
      { url: "/terms", updatedAt: new Date().toISOString() },
      { url: "/privacy-policy", updatedAt: new Date().toISOString() },
    ];
    staticPages.forEach((page) => {
      sitemap
        .ele("url")
        .ele("loc", `${baseUrl}${page.url}`)
        .up()
        .ele("lastmod", page.updatedAt)
        .up()
        .ele("changefreq", "monthly")
        .up()
        .ele("priority", "1.0")
        .up();
    });

    // Add Dynamic Job Pages
    console.log("Adding dynamic job pages...");
    jobs.forEach((job) => {
      sitemap
        .ele("url")
        .ele("loc", `${baseUrl}/job/${job._id}`)
        .up()
        .ele("lastmod", job.updatedAt || new Date().toISOString())
        .up()
        .ele("changefreq", "daily")
        .up()
        .ele("priority", "0.8")
        .up();
    });

    // Add Dynamic Blog Pages
    console.log("Adding dynamic blog pages...");
    blogs.forEach((blog) => {
      sitemap
        .ele("url")
        .ele("loc", `${baseUrl}/blog/${blog.slug}`)
        .up()
        .ele("lastmod", blog.updatedAt || new Date().toISOString())
        .up()
        .ele("changefreq", "daily")
        .up()
        .ele("priority", "0.8")
        .up();
    });

    // Set Header and Send Response
    console.log("Sending sitemap response...");
    res.header("Content-Type", "application/xml");
    res.send(sitemap.end({ pretty: true }));
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send(`Error generating sitemap: ${error.message}`);
  }
});

module.exports = sitemapRouter;
