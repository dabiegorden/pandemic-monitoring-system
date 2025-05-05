// contact.js
const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required" });
  }

  const query =
    "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)";
  try {
    await db.execute(query, [name, email, subject, message]);
    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the form" });
  }
});

// GET endpoint to retrieve contacts
router.get("/", async (req, res) => {
  const query = "SELECT * FROM contacts";

  try {
    const [rows] = await db.query(query); // Fetch all contacts
    res.status(200).json(rows); // Send the contacts as a JSON response
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving contacts" });
  }
});

module.exports = router;
