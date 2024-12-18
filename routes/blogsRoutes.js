// i am not usingthis routes

// routes/blogRoutes.js
const express = require("express");
const { blogSchema } = require("../validation/schemas");
const validateRequest = require("../validation/validate");
const slugify = require("slugify"); // Add this package for slug generation

const router = express.Router();

// Create a new blog post
router.post("/post-blog", validateRequest(blogSchema), async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const body = req.body;

    // Automatically generate a slug from the title
    const generatedSlug = slugify(body.title, {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters
    });

    // Add the slug to the body before saving
    body.slug = generatedSlug;
    body.publishedDate = new Date();

    // Insert the new blog post into the database
    const result = await blogCollection.insertOne(body);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error posting blog:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get all blog posts
router.get("/all-blogs", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const blogs = await blogCollection.find().toArray();
    const sortedBlogs = blogs.sort((a, b) => b.publishedDate - a.publishedDate);
    res.send(sortedBlogs);
  } catch (error) {
    console.error("Error getting all blogs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get single blog by slug
router.get("/all-blogs/:slug", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const slug = req.params.slug;
    const blog = await blogCollection.findOne({ slug });
    if (blog) {
      res.send(blog);
    } else {
      res.status(404).send({ message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get blogs by author
router.get("/myBlogs/:author", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const { author } = req.params;
    const blogs = await blogCollection.find({ author }).toArray();
    res.status(200).send(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Delete a blog by slug
router.delete("/blog/:slug", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const slug = req.params.slug;
    const result = await blogCollection.deleteOne({ slug });
    if (result.deletedCount === 1) {
      res.send({ message: "Blog deleted successfully" });
    } else {
      res.status(404).send({ message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Update a blog by slug
router.patch(
  "/update-blog/:slug",
  validateRequest(blogSchema),
  async (req, res) => {
    const db = req.app.locals.db;
    const blogCollection = db.collection("blogs");

    try {
      const slug = req.params.slug;
      const blogData = req.body;
      const result = await blogCollection.updateOne(
        { slug },
        { $set: blogData },
        { upsert: true }
      );

      if (result.matchedCount === 1) {
        res.send({ acknowledged: true, message: "Blog updated successfully" });
      } else {
        res
          .status(404)
          .send({ acknowledged: false, message: "Blog not found" });
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      res
        .status(500)
        .send({ acknowledged: false, message: "Server error", error });
    }
  }
);

module.exports = router;
