// const express = require("express");
// const router = express.Router();
// const { contactSchema } = require("../validation/schemas");
// const validate = require("../validation/validate");
// const nodemailer = require("nodemailer");

// router.post("/contact", validate(contactSchema), async (req, res) => {
//   try {
//     const { firstName, lastName, email, message } = req.body;

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: email,
//       to: process.env.EMAIL_USERNAME,
//       subject: `Contact Us Message from ${firstName} ${lastName}`,
//       text: `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nMessage: ${message}`,
//     });

//     res.status(200).json({ message: "Message sent successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res
//       .status(500)
//       .json({ error: "Something went wrong. Please try again later." });
//   }
// });
// module.exports = router;

// const express = require("express");
// const nodemailer = require("nodemailer");
// const { contactSchema } = require("../validation/schemas");
// const validate = require("../validation/validate");

// const router = express.Router();

// router.post("/contact", validate(contactSchema), async (req, res) => {
//   try {
//     const { firstName, lastName, email, message } = req.body;

//     const db = req.app.locals.db;
//     const contactCollection = db.collection("contactus");

//     // Save to database
//     const newContact = {
//       firstName,
//       lastName,
//       email,
//       message,
//     };

//     const body = req.body;
//     const result = await contactCollection.insertOne(body);

//     await contactCollection.insertOne(newContact);

//     // Send email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: email,
//       to: process.env.EMAIL_USERNAME,
//       subject: `Contact Us Message from ${firstName} ${lastName}`,
//       text: `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nMessage: ${message}`,
//     });

//     res
//       .status(200)
//       .send(result)
//       .json({ message: "Message sent and saved successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res
//       .status(500)
//       .json({ error: "Something went wrong. Please try again later." });
//   }
// });

// module.exports = router;

const express = require("express");
const nodemailer = require("nodemailer");
const { contactSchema } = require("../validation/schemas");
const validate = require("../validation/validate");

const router = express.Router();

router.post("/contact", validate(contactSchema), async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    const db = req.app.locals.db;
    const contactCollection = db.collection("contactus");

    // Save to database
    const newContact = {
      firstName,
      lastName,
      email,
      message,
    };

    await contactCollection.insertOne(newContact);

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USERNAME,
      subject: `Contact Us Message from ${firstName} ${lastName}`,
      text: `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nMessage: ${message}`,
    });

    // Send success response
    return res
      .status(200)
      .json({ message: "Message sent and saved successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);

    // Check if response has already been sent
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ error: "Something went wrong. Please try again later." });
    }
  }
});

module.exports = router;
