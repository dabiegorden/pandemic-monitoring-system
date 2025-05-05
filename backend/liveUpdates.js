const express = require("express");
const router = express.Router();

const API_URL = "https://disease.sh/v3/covid-19/all";

let io; // WebSocket instance

const setSocket = (socketIo) => {
  io = socketIo;
};

// Fetch live updates
router.get("/", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching live updates:", error);
    res.status(500).json({ error: "Failed to fetch live updates" });
  }
});

// Function to fetch data and emit updates via WebSockets
const fetchAndEmitUpdates = async () => {
  if (!io) return;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    io.emit("liveUpdate", data); // Send data to all clients
  } catch (error) {
    console.error("Error fetching WebSocket updates:", error);
  }
};

// Fetch new data every 60 seconds and send via WebSocket
setInterval(fetchAndEmitUpdates, 60000);

module.exports = { router, setSocket };
