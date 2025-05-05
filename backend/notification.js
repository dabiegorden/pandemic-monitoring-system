const express = require("express");
const router = express.Router();
const db = require("./db"); // Import your database connection

// Fetch all unread notifications
router.get("/notifications", async (req, res) => {
  try {
    const query =
      "SELECT * FROM notifications WHERE is_read = FALSE ORDER BY date DESC";
    const [notifications] = await db.query(query);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Error fetching notifications." });
  }
});

// Mark notification as read
router.post("/notifications/read", async (req, res) => {
  const { id } = req.body;

  try {
    const query = "UPDATE notifications SET is_read = TRUE WHERE id = ?";
    await db.execute(query, [id]);
    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Error marking notification as read." });
  }
});

module.exports = router;
