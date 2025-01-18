// const express = require("express");
// const { ObjectId } = require("mongodb");
// const router = express.Router();
// const resumeSchema = require("../validation/resumeSchema");
// const validate = require("../validation/validate");

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to post a new resume
// router.post("/create-resume", validate(resumeSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const body = req.body;
//     body.createdAt = new Date();

//     // Insert resume into the database
//     const result = await resumesCollection.insertOne(body);

//     res.status(200).send(result);
//   } catch (error) {
//     console.error("Error posting resume:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to fetch all resumes
// router.get("/all-resumes", async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const resumes = await resumesCollection.find().toArray();
//     res.status(200).send(resumes);
//   } catch (error) {
//     console.error("Error getting all resumes:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to fetch a single resume by ID
// router.get("/resume/:id", async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const id = req.params.id;
//     const resume = await resumesCollection.findOne({ _id: new ObjectId(id) });
//     if (resume) {
//       res.status(200).send(resume);
//     } else {
//       res.status(404).send({ message: "Resume not found" });
//     }
//   } catch (error) {
//     console.error("Error getting resume:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to delete a resume by ID
// router.delete("/resume/:id", async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const id = req.params.id;
//     const result = await resumesCollection.deleteOne({ _id: new ObjectId(id) });
//     if (result.deletedCount === 1) {
//       res.status(200).send({ message: "Resume deleted successfully" });
//     } else {
//       res.status(404).send({ message: "Resume not found" });
//     }
//   } catch (error) {
//     console.error("Error deleting resume:", error);
//     res.status(500).send({ message: "Server error", error });
//   }
// });

// ///////////////////////////////////////////////////////////////////////////////////////

// // Route to update a resume by ID
// router.patch("/update-resume/:id", validate(resumeSchema), async (req, res) => {
//   const db = req.app.locals.db;
//   const resumesCollection = db.collection("resumes");

//   try {
//     const id = req.params.id;
//     const resumeData = req.body;

//     const result = await resumesCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: resumeData },
//       { upsert: true }
//     );

//     if (result.matchedCount === 1) {
//       res
//         .status(200)
//         .send({ acknowledged: true, message: "Resume updated successfully" });
//     } else {
//       res
//         .status(404)
//         .send({ acknowledged: false, message: "Resume not found" });
//     }
//   } catch (error) {
//     console.error("Error updating resume:", error);
//     res
//       .status(500)
//       .send({ acknowledged: false, message: "Server error", error });
//   }
// });

// module.exports = router;
