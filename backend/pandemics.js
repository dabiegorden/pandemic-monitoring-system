const express = require("express");
const router = express.Router();
const db = require("./db");
const { isAuthenticated } = require("./middleware/auth");

// Get all pandemics (public route)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pandemics");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed." });
  }
});

// Get pandemic by ID (public route)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM pandemics WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Pandemic not found." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed." });
  }
});

// Add a new pandemic (protected route)
router.post("/", isAuthenticated, async (req, res) => {
  const {
    name,
    start_year,
    end_year,
    death_toll,
    recovered,
    survivors,
    countries_affected,
    population,
  } = req.body;

  if (!name || !start_year || !death_toll) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  try {
    const query = `
      INSERT INTO pandemics (name, start_year, end_year, death_toll, recovered, survivors, countries_affected, population)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      name,
      start_year,
      end_year,
      death_toll,
      recovered || "Unknown",
      survivors || "Unknown",
      countries_affected || "Unknown",
      population || null,
    ]);
    res
      .status(201)
      .json({ id: result.insertId, message: "Pandemic added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add pandemic." });
  }
});

// Update a pandemic (protected route)
router.put("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    start_year,
    end_year,
    death_toll,
    recovered,
    survivors,
    countries_affected,
    population,
  } = req.body;

  try {
    const query = `
      UPDATE pandemics  
      SET name = ?, start_year = ?, end_year = ?, death_toll = ?, recovered = ?, survivors = ?, countries_affected = ?, population = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      name,
      start_year,
      end_year,
      death_toll,
      recovered,
      survivors,
      countries_affected,
      population,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pandemic not found." });
    }

    res.status(200).json({ message: "Pandemic updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update pandemic." });
  }
});

// Delete a pandemic (protected route)
router.delete("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM pandemics WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pandemic not found." });
    }

    res.status(200).json({ message: "Pandemic deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete pandemic." });
  }
});

module.exports = router;
