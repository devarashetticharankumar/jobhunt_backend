// const express = require("express");
// const { ObjectId } = require("mongodb");
// const router = express.Router();
// const resumeSchema = require("../validation/resumeSchema");
// const validate = require("../validation/validate");

// // Middleware to validate ObjectId
// const validateObjectId = (req, res, next) => {
//   const { id } = req.params;
//   if (!ObjectId.isValid(id)) {
//     return res.status(400).send({ message: "Invalid ID format" });
//   }
//   next();
// };

// // Utility function for standardized API responses
// const sendResponse = (res, status, message, data = null) => {
//   res.status(status).send({ message, data });
// };

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to post a new resume
// router.post("/create-resume", validate(resumeSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const body = req.body;
//     body.createdAt = new Date();

//     const result = await resumesCollection.insertOne(body);

//     if (result.insertedId) {
//       sendResponse(res, 201, "Resume created successfully", {
//         resumeId: result.insertedId,
//       });
//     } else {
//       sendResponse(res, 500, "Error inserting resume");
//     }
//   } catch (error) {
//     console.error("Error posting resume:", error);
//     sendResponse(res, 500, "Server error", { error: error.message });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to fetch all resumes
// router.get("/all-resumes", async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const resumes = await resumesCollection
//       .find()
//       .project({ sensitiveField: 0 }) // Exclude sensitive fields
//       .toArray();

//     sendResponse(res, 200, "Resumes fetched successfully", resumes);
//   } catch (error) {
//     console.error("Error getting all resumes:", error);
//     sendResponse(res, 500, "Server error", { error: error.message });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to fetch a single resume by ID
// router.get("/resume/:id", validateObjectId, async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const id = req.params.id;

//     const resume = await resumesCollection.findOne(
//       { _id: new ObjectId(id) },
//       { projection: { sensitiveField: 0 } } // Exclude sensitive fields
//     );

//     if (!resume) {
//       return sendResponse(res, 404, "Resume not found");
//     }

//     sendResponse(res, 200, "Resume fetched successfully", resume);
//   } catch (error) {
//     console.error("Error getting resume:", error);
//     sendResponse(res, 500, "Server error", { error: error.message });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to delete a resume by ID
// router.delete("/resume/:id", validateObjectId, async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const id = req.params.id;

//     const result = await resumesCollection.deleteOne({
//       _id: new ObjectId(id),
//     });

//     if (result.deletedCount === 1) {
//       sendResponse(res, 200, "Resume deleted successfully");
//     } else {
//       sendResponse(res, 404, "Resume not found");
//     }
//   } catch (error) {
//     console.error("Error deleting resume:", error);
//     sendResponse(res, 500, "Server error", { error: error.message });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to update a resume by ID
// router.patch(
//   "/update-resume/:id",
//   [validateObjectId, validate(resumeSchema)],
//   async (req, res) => {
//     const db = req.app.locals.db;
//     const resumesCollection = db.collection("resumes");

//     try {
//       const id = req.params.id;
//       const resumeData = req.body;

//       const result = await resumesCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: resumeData },
//         { upsert: false }
//       );

//       if (result.matchedCount === 1) {
//         sendResponse(res, 200, "Resume updated successfully");
//       } else {
//         sendResponse(res, 404, "Resume not found");
//       }
//     } catch (error) {
//       console.error("Error updating resume:", error);
//       sendResponse(res, 500, "Server error", { error: error.message });
//     }
//   }
// );

// module.exports = router;

const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const resumeSchema = require("../validation/resumeSchema");
const validate = require("../validation/validate");

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  next();
};

// Utility function for standardized API responses
const sendResponse = (res, status, message, data = null) => {
  res.status(status).send({ message, data });
};

// Middleware to ensure authentication
const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized: Please log in" });
  }
  next();
};

///////////////////////////////////////////////////////////////////////////////////////

// Route to post a new resume (authenticated)
router.post(
  "/create-resume",
  [ensureAuthenticated, validate(resumeSchema)],
  async (req, res) => {
    const db = req.app.locals.db;
    const resumesCollection = db.collection("resumes");

    try {
      const body = req.body;
      body.userId = req.user.sub; // Add authenticated user's ID
      body.createdAt = new Date();

      const result = await resumesCollection.insertOne(body);

      if (result.insertedId) {
        sendResponse(res, 201, "Resume created successfully", {
          resumeId: result.insertedId,
        });
      } else {
        sendResponse(res, 500, "Error inserting resume");
      }
    } catch (error) {
      console.error("Error posting resume:", error);
      sendResponse(res, 500, "Server error", { error: error.message });
    }
  }
);

///////////////////////////////////////////////////////////////////////////////////////

// Route to fetch authenticated user's resumes only
router.get("/all-resumes", ensureAuthenticated, async (req, res) => {
  const db = req.app.locals.db;
  const resumesCollection = db.collection("resumes");

  try {
    const resumes = await resumesCollection
      .find({ userId: req.user.sub }) // Filter by authenticated user
      .project({ sensitiveField: 0 })
      .toArray();

    sendResponse(res, 200, "Resumes fetched successfully", resumes);
  } catch (error) {
    console.error("Error getting user's resumes:", error);
    sendResponse(res, 500, "Server error", { error: error.message });
  }
});

///////////////////////////////////////////////////////////////////////////////////////

// Route to fetch a single resume by ID (authenticated and authorized)
router.get(
  "/resume/:id",
  [ensureAuthenticated, validateObjectId],
  async (req, res) => {
    const db = req.app.locals.db;
    const resumesCollection = db.collection("resumes");

    try {
      const id = req.params.id;

      const resume = await resumesCollection.findOne(
        {
          _id: new ObjectId(id),
          userId: req.user.sub, // Ensure it belongs to the user
        },
        { projection: { sensitiveField: 0 } }
      );

      if (!resume) {
        return sendResponse(res, 404, "Resume not found or unauthorized");
      }

      sendResponse(res, 200, "Resume fetched successfully", resume);
    } catch (error) {
      console.error("Error getting resume:", error);
      sendResponse(res, 500, "Server error", { error: error.message });
    }
  }
);

///////////////////////////////////////////////////////////////////////////////////////

// Route to delete a resume by ID (authenticated and authorized)
router.delete(
  "/resume/:id",
  [ensureAuthenticated, validateObjectId],
  async (req, res) => {
    // Removed the erroneous .NAME
    const db = req.app.locals.db;
    const resumesCollection = db.collection("resumes");

    try {
      const id = req.params.id;

      const result = await resumesCollection.deleteOne({
        _id: new ObjectId(id),
        userId: req.user.sub, // Ensure it belongs to the user
      });

      if (result.deletedCount === 1) {
        sendResponse(res, 200, "Resume deleted successfully");
      } else {
        sendResponse(res, 404, "Resume not found or unauthorized");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      sendResponse(res, 500, "Server error", { error: error.message });
    }
  }
);
///////////////////////////////////////////////////////////////////////////////////////

// Route to update a resume by ID (authenticated and authorized)
router.patch(
  "/update-resume/:id",
  [ensureAuthenticated, validateObjectId, validate(resumeSchema)],
  async (req, res) => {
    const db = req.app.locals.db;
    const resumesCollection = db.collection("resumes");

    try {
      const id = req.params.id;
      const resumeData = req.body;

      const result = await resumesCollection.updateOne(
        {
          _id: new ObjectId(id),
          userId: req.user.sub, // Ensure it belongs to the user
        },
        { $set: resumeData },
        { upsert: false }
      );

      if (result.matchedCount === 1) {
        sendResponse(res, 200, "Resume updated successfully");
      } else {
        sendResponse(res, 404, "Resume not found or unauthorized");
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      sendResponse(res, 500, "Server error", { error: error.message });
    }
  }
);

module.exports = router;
