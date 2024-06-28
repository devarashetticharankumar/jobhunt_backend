const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { userSchema, loginSchema } = require("../validation/schemas");
const validate = require("../validation/validate");

// User Registration
router.post("/register", validate(userSchema), async (req, res) => {
  const db = req.app.locals.db;
  const userCollections = db.collection("User");
  try {
    const body = req.body;
    body.createdAt = new Date();

    const existingUser = await userCollections.findOne({ email: body.email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "Email already exists", status: false });
    }

    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
    const result = await userCollections.insertOne(body);
    if (result.insertedId) {
      const token = jwt.sign(
        { userId: result.insertedId },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({ user: body, token });
    } else {
      res.status(500).send({
        message: "Cannot register user, try again later",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

// User Login
router.post("/login", validate(loginSchema), async (req, res) => {
  const db = req.app.locals.db;
  const userCollections = db.collection("User");
  try {
    const body = req.body;
    const user = await userCollections.findOne({ email: body.email });
    if (user) {
      const isValid = await bcrypt.compare(body.password, user.password);
      if (isValid) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).send({ user, token });
      } else {
        res
          .status(401)
          .send({ message: "Invalid email or password", status: false });
      }
    } else {
      res
        .status(401)
        .send({ message: "Invalid email or password", status: false });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({ message: "Server error", error });
  }
});

module.exports = router;
