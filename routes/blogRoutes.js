const express = require("express");
const router = express.Router();
const blogSchema = require("../validation/blogSchema");
const validate = require("../validation/validate");
const cors = require("cors");
const app = express();
app.use(cors()); // Apply CORS globally

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace spaces or non-alphanumeric characters with hyphens
    .replace(/^[-]+|[-]+$/g, ""); // Remove leading/trailing hyphens
};

// Create Blog
router.post("/create-blog", validate(blogSchema), async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const body = req.body;
    if (!body.title || !body.content) {
      return res
        .status(400)
        .send({ message: "Title and content are required" });
    }

    body.publishedDate = new Date(); // Set the published date to the current date if not provided
    body.slug = generateSlug(body.title); // Generate slug from title

    // Insert blog post into the database
    const result = await blogCollection.insertOne(body);
    console.log("Insert Result:", result); // Log the result for debugging

    if (result.acknowledged) {
      // Retrieve the inserted blog document
      const insertedBlog = await blogCollection.findOne({
        _id: result.insertedId,
      });

      res.status(201).send({
        message: "Blog created successfully",
        blog: insertedBlog,
      });
    } else {
      res.status(400).send({ message: "Failed to create blog" });
    }
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get all Blogs
router.get("/all-blogs", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const blogs = await blogCollection
      .aggregate([
        { $sort: { publishedDate: -1 } },
        {
          $project: {
            _id: 1,
            title: 1,
            slug: 1,
            category: 1,
            author: 1,
            thumbnail: 1,
            publishedDate: 1
          },
        },
      ])
      .toArray();
    res.send(blogs);
  } catch (error) {
    console.error("Error getting all blogs:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// Get Blog by Slug
router.get("/blog/:slug", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const slug = req.params.slug;
    const blog = await blogCollection.findOne({ slug: slug });

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

// Delete Blog by Slug
router.delete("/blog/:slug", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const slug = req.params.slug;
    const result = await blogCollection.deleteOne({ slug: slug });

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

// Update Blog by Slug
router.patch("/update-blog/:slug", validate(blogSchema), async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const slug = req.params.slug;
    const blogData = req.body;

    if (blogData.title) {
      blogData.slug = generateSlug(blogData.title); // Generate slug if title is updated
    }

    const result = await blogCollection.updateOne(
      { slug: slug },
      { $set: blogData }
    );

    if (result.matchedCount === 1) {
      res.send({ acknowledged: true, message: "Blog updated successfully" });
    } else {
      res.status(404).send({ acknowledged: false, message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .send({ acknowledged: false, message: "Server error", error });
  }
});

// Bulk Post Blogs
router.post("/bulk-post", async (req, res) => {
  const db = req.app.locals.db;
  const blogCollection = db.collection("blogs");

  try {
    const blogs = req.body;
    if (!Array.isArray(blogs)) {
      return res.status(400).send({ message: "Request body must be an array" });
    }

    const validBlogs = blogs.filter(b => b.title && b.content);
    if (validBlogs.length === 0) {
      return res.status(400).send({ message: "No valid blogs found. Title and content are required." });
    }

    const processedBlogs = validBlogs.map(blog => ({
      ...blog,
      publishedDate: new Date(),
      slug: generateSlug(blog.title)
    }));

    const result = await blogCollection.insertMany(processedBlogs);

    res.status(201).send({
      acknowledged: true,
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds
    });
  } catch (error) {
    console.error("Bulk blog post error:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const blogSchema = require("../validation/blogSchema");
// const validate = require("../validation/validate");
// const cors = require("cors");
// const app = express();
// app.use(cors()); // Apply CORS globally

// const generateSlug = (title) => {
//   return title
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-") // Replace spaces or non-alphanumeric characters with hyphens
//     .replace(/^[-]+|[-]+$/g, ""); // Remove leading/trailing hyphens
// };

// // Create Blog
// router.post("/create-blog", validate(blogSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const blogCollection = db.collection("blogs");

//   try {
//     const body = req.body;
//     if (!body.title || !body.content) {
//       return res
//         .status(400)
//         .send({ message: "Title and content are required" });
//     }

//     body.publishedDate = new Date(); // Set the published date to the current date if not provided
//     body.slug = generateSlug(body.title); // Generate slug from title

//     // Insert blog post into the database
//     const result = await blogCollection.insertOne(body);
//     console.log("Insert Result:", result); // Log the result for debugging

//     if (result.acknowledged) {
//       // Retrieve the inserted blog document
//       const insertedBlog = await blogCollection.findOne({
//         _id: result.insertedId,
//       });

//       res.status(201).send({
//         message: "Blog created successfully",
//         blog: insertedBlog,
//       });
//     } else {
//       res.status(400).send({ message: "Failed to create blog" });
//     }
//   } catch (error) {
//     console.error("Error creating blog post:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Get all Blogs
// router.get("/all-blogs", async (req, res) => {
//   const db = req.app.locals.db;
//   const blogCollection = db.collection("blogs");

//   try {
//     const blogs = await blogCollection.find().toArray();
//     const sortedBlogs = blogs.sort(
//       (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate) // Sort by published date
//     );
//     res.send(sortedBlogs);
//   } catch (error) {
//     console.error("Error getting all blogs:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Get all Blogs with Pagination
// // router.get("/all-blogs", async (req, res) => {
// //   const db = req.app.locals.db;
// //   const blogCollection = db.collection("blogs");

// //   // Get page and limit from query parameters, with defaults if not provided
// //   const page = parseInt(req.query.page) || 1;
// //   const limit = parseInt(req.query.limit) || 10;

// //   const skip = (page - 1) * limit;

// //   try {
// //     const totalBlogs = await blogCollection.countDocuments(); // Get the total number of blogs
// //     const blogs = await blogCollection
// //       .find()
// //       .skip(skip) // Skip the number of documents based on the page
// //       .limit(limit) // Limit the number of documents to the specified limit
// //       .toArray();

// //     // Sort by published date
// //     const sortedBlogs = blogs.sort(
// //       (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
// //     );

// //     // Send the response with pagination details
// //     res.send({
// //       blogs: sortedBlogs,
// //       currentPage: page,
// //       totalPages: Math.ceil(totalBlogs / limit), // Calculate the total number of pages
// //       totalBlogs: totalBlogs,
// //     });
// //   } catch (error) {
// //     console.error("Error getting all blogs:", error);
// //     res.status(500).send({ message: "Server error", error });
// //   }
// // });

// // Get Blog by Slug
// router.get("/blog/:slug", async (req, res) => {
//   const db = req.app.locals.db;
//   const blogCollection = db.collection("blogs");

//   try {
//     const slug = req.params.slug;
//     const blog = await blogCollection.findOne({ slug: slug });

//     if (blog) {
//       res.send(blog);
//     } else {
//       res.status(404).send({ message: "Blog not found" });
//     }
//   } catch (error) {
//     console.error("Error getting blog:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Delete Blog by Slug
// router.delete("/blog/:slug", async (req, res) => {
//   const db = req.app.locals.db;
//   const blogCollection = db.collection("blogs");

//   try {
//     const slug = req.params.slug;
//     const result = await blogCollection.deleteOne({ slug: slug });

//     if (result.deletedCount === 1) {
//       res.send({ message: "Blog deleted successfully" });
//     } else {
//       res.status(404).send({ message: "Blog not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting blog:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// // Update Blog by Slug
// router.patch("/update-blog/:slug", validate(blogSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const blogCollection = db.collection("blogs");

//   try {
//     const slug = req.params.slug;
//     const blogData = req.body;

//     if (blogData.title) {
//       blogData.slug = generateSlug(blogData.title); // Generate slug if title is updated
//     }

//     const result = await blogCollection.updateOne(
//       { slug: slug },
//       { $set: blogData }
//     );

//     if (result.matchedCount === 1) {
//       res.send({ acknowledged: true, message: "Blog updated successfully" });
//     } else {
//       res.status(404).send({ acknowledged: false, message: "Blog not found" });
//     }
//   } catch (error) {
//     console.error("Error updating blog:", error);
//     res
//       .status(500)
//       .send({ acknowledged: false, message: "Server error", error });
//   }
// });

// module.exports = router;
