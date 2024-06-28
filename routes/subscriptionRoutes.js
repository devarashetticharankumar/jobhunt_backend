const express = require("express");
const router = express.Router();
const { emailSubscriptionSchema } = require("../validation/schemas");
const validate = require("../validation/validate");

// Subscribe to email notifications
router.post(
  "/subscribe",
  validate(emailSubscriptionSchema),
  async (req, res) => {
    const db = req.app.locals.db;
    const subscriptionsCollection = db.collection("EmailSubscriptions");
    try {
      const { email } = req.body;
      const existingSubscription = await subscriptionsCollection.findOne({
        email,
      });
      if (existingSubscription) {
        return res
          .status(400)
          .send({ message: "Email already subscribed", status: false });
      }

      const result = await subscriptionsCollection.insertOne({
        email,
        createdAt: new Date(),
      });
      if (result.insertedId) {
        res
          .status(200)
          .send({ message: "Subscription successful", status: true });
      } else {
        res.status(500).send({
          message: "Cannot subscribe, try again later",
          status: false,
        });
      }
    } catch (error) {
      console.error("Error subscribing email:", error);
      res.status(500).send({ message: "Server error", error });
    }
  }
);

// Unsubscribe from email notifications
router.post(
  "/unsubscribe",
  validate(emailSubscriptionSchema),
  async (req, res) => {
    const db = req.app.locals.db;
    const subscriptionsCollection = db.collection("EmailSubscriptions");
    try {
      const { email } = req.body;
      const result = await subscriptionsCollection.deleteOne({ email });
      if (result.deletedCount === 1) {
        res
          .status(200)
          .send({ message: "Unsubscription successful", status: true });
      } else {
        res.status(404).send({ message: "Email not found", status: false });
      }
    } catch (error) {
      console.error("Error unsubscribing email:", error);
      res.status(500).send({ message: "Server error", error });
    }
  }
);

module.exports = router;
