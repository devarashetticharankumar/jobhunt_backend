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

// // Route to post a new resume (only authenticated users can create resumes)
// router.post("/create-resume", validate(resumeSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const body = req.body;
//     body.createdAt = new Date();
//     body.userId = req.user?.sub; // Ensure user is authenticated

//     if (!body.userId) {
//       return sendResponse(res, 401, "Unauthorized: User ID not found");
//     }

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

// // Route to fetch all resumes (only authenticated users can view their resumes)
// router.get("/all-resumes", async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const userId = req.user?.sub;

//     if (!userId) {
//       return sendResponse(res, 401, "Unauthorized: User not authenticated");
//     }

//     const resumes = await resumesCollection
//       .find({ userId })
//       .project({ sensitiveField: 0 }) // Exclude sensitive fields
//       .toArray();

//     sendResponse(res, 200, "Resumes fetched successfully", resumes);
//   } catch (error) {
//     console.error("Error getting all resumes:", error);
//     sendResponse(res, 500, "Server error", { error: error.message });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to fetch a single resume by ID (only the owner can view their resume)
// router.get("/resume/:id", validateObjectId, async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const id = req.params.id;
//     const userId = req.user?.sub;

//     if (!userId) {
//       return sendResponse(res, 401, "Unauthorized: User not authenticated");
//     }

//     const resume = await resumesCollection.findOne(
//       { _id: new ObjectId(id), userId },
//       { projection: { sensitiveField: 0 } } // Exclude sensitive fields
//     );

//     if (!resume) {
//       return sendResponse(res, 404, "Resume not found or unauthorized access");
//     }

//     sendResponse(res, 200, "Resume fetched successfully", resume);
//   } catch (error) {
//     console.error("Error getting resume:", error);
//     sendResponse(res, 500, "Server error", { error: error.message });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to delete a resume by ID (only the owner can delete their resume)
// router.delete("/resume/:id", validateObjectId, async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const id = req.params.id;
//     const userId = req.user?.sub;

//     if (!userId) {
//       return sendResponse(res, 401, "Unauthorized: User not authenticated");
//     }

//     const result = await resumesCollection.deleteOne({
//       _id: new ObjectId(id),
//       userId,
//     });

//     if (result.deletedCount === 1) {
//       sendResponse(res, 200, "Resume deleted successfully");
//     } else {
//       sendResponse(res, 404, "Resume not found or unauthorized access");
//     }
//   } catch (error) {
//     console.error("Error deleting resume:", error);
//     sendResponse(res, 500, "Server error", { error: error.message });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to update a resume by ID (only the owner can update their resume)
// router.patch(
//   "/update-resume/:id",
//   [validateObjectId, validate(resumeSchema)],
//   async (req, res) => {
//     const db = req.app.locals.db;
//     const resumesCollection = db.collection("resumes");

//     try {
//       const id = req.params.id;
//       const userId = req.user?.sub;

//       if (!userId) {
//         return sendResponse(res, 401, "Unauthorized: User not authenticated");
//       }

//       const resumeData = req.body;

//       const result = await resumesCollection.updateOne(
//         { _id: new ObjectId(id), userId },
//         { $set: resumeData },
//         { upsert: false }
//       );

//       if (result.matchedCount === 1) {
//         sendResponse(res, 200, "Resume updated successfully");
//       } else {
//         sendResponse(res, 404, "Resume not found or unauthorized access");
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

///////////////////////////////////////////////////////////////////////////////////////

// Route to post a new resume
router.post("/create-resume", validate(resumeSchema), async (req, res) => {
  const db = req.app.locals.db;
  const resumesCollection = db.collection("resumes");

  try {
    const body = req.body;
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
});

///////////////////////////////////////////////////////////////////////////////////////

// Route to fetch all resumes
router.get("/all-resumes", async (req, res) => {
  const db = req.app.locals.db;
  const resumesCollection = db.collection("resumes");

  try {
    const resumes = await resumesCollection
      .find()
      .project({ sensitiveField: 0 }) // Exclude sensitive fields
      .toArray();

    sendResponse(res, 200, "Resumes fetched successfully", resumes);
  } catch (error) {
    console.error("Error getting all resumes:", error);
    sendResponse(res, 500, "Server error", { error: error.message });
  }
});

///////////////////////////////////////////////////////////////////////////////////////

// Route to fetch a single resume by ID
router.get("/resume/:id", validateObjectId, async (req, res) => {
  const db = req.app.locals.db;
  const resumesCollection = db.collection("resumes");

  try {
    const id = req.params.id;

    const resume = await resumesCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { sensitiveField: 0 } } // Exclude sensitive fields
    );

    if (!resume) {
      return sendResponse(res, 404, "Resume not found");
    }

    sendResponse(res, 200, "Resume fetched successfully", resume);
  } catch (error) {
    console.error("Error getting resume:", error);
    sendResponse(res, 500, "Server error", { error: error.message });
  }
});

///////////////////////////////////////////////////////////////////////////////////////

// Route to delete a resume by ID
router.delete("/resume/:id", validateObjectId, async (req, res) => {
  const db = req.app.locals.db;
  const resumesCollection = db.collection("resumes");

  try {
    const id = req.params.id;

    const result = await resumesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      sendResponse(res, 200, "Resume deleted successfully");
    } else {
      sendResponse(res, 404, "Resume not found");
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    sendResponse(res, 500, "Server error", { error: error.message });
  }
});

///////////////////////////////////////////////////////////////////////////////////////

// Route to update a resume by ID
router.patch(
  "/update-resume/:id",
  [validateObjectId, validate(resumeSchema)],
  async (req, res) => {
    const db = req.app.locals.db;
    const resumesCollection = db.collection("resumes");

    try {
      const id = req.params.id;
      const resumeData = req.body;

      const result = await resumesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: resumeData },
        { upsert: false }
      );

      if (result.matchedCount === 1) {
        sendResponse(res, 200, "Resume updated successfully");
      } else {
        sendResponse(res, 404, "Resume not found");
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      sendResponse(res, 500, "Server error", { error: error.message });
    }
  }
);

module.exports = router;
