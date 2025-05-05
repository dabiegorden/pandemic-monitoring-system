const express = require("express");
const router = express.Router();
const db = require("./db");

// Get all pandemic cases
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pandemic_cases");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pandemic cases." });
  }
});

// Get pandemic cases by pandemic_id
router.get("/:pandemic_id", async (req, res) => {
  const { pandemic_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM pandemic_cases WHERE pandemic_id = ?",
      [pandemic_id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No cases found for this pandemic." });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pandemic cases." });
  }
});

// Add new pandemic case
router.post("/", async (req, res) => {
  const { pandemic_id, cases, date_time, country, state, city } = req.body;

  if (!pandemic_id || !cases || !date_time || !country) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  try {
    const query = `
      INSERT INTO pandemic_cases (pandemic_id, cases, date_time, country, state, city)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      pandemic_id,
      cases,
      date_time,
      country,
      state || null,
      city || null,
    ]);
    res.status(201).json({
      id: result.insertId,
      message: "Pandemic case added successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add pandemic case." });
  }
});

// Update pandemic case
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { pandemic_id, cases, date_time, country, state, city } = req.body;

  try {
    const query = `
      UPDATE pandemic_cases 
      SET pandemic_id = ?, cases = ?, date_time = ?, country = ?, state = ?, city = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      pandemic_id,
      cases,
      date_time,
      country,
      state || null,
      city || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pandemic case not found." });
    }

    res.status(200).json({ message: "Pandemic case updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update pandemic case." });
  }
});

// Delete pandemic case
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      "DELETE FROM pandemic_cases WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pandemic case not found." });
    }

    res.status(200).json({ message: "Pandemic case deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete pandemic case." });
  }
});

module.exports = router;
