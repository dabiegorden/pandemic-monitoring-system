const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required!" });
  }

  const query = "INSERT INTO subscriptions (email) VALUES (?)";

  try {
    await db.execute(query, [email]);
    res.status(201).json({ message: "THank you for subscribing" });
  } catch (error) {
    console.error("Database error:", error);
    // Check if the error is due to duplicate email
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "This email is already subscribed." });
    } else {
      res.status(500).json({ error: "An error occurred while subscribing." });
    }
  }
});

module.exports = router;
