// Example backend route handler for reference
const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/", async (req, res) => {
  const { name, email, profession, interests } = req.body;

  // Simple validation
  if (!name || !email || !profession || !interests) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Insert data into the MySQL database
    const sql = `INSERT INTO community_members (name, email, profession, interests) VALUES (?, ?, ?, ?)`;

    const [result] = await db.execute(sql, [
      name,
      email,
      profession,
      interests,
    ]);

    // Send a simple success response
    res.status(201).json({
      message: "Form submitted successfully",
      memberId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting data: ", error);

    // Check for duplicate email error
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "This email is already registered in our community" });
    }

    return res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;
