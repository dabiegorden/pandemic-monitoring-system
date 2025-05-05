const express = require("express");
const router = express.Router();
const db = require("./db");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Handle POST request for predictions using GoogleGenerativeAI API
router.post("/", async (req, res) => {
  const { userInput } = req.body; // Extract user input for prediction

  try {
    // Fetch the latest pandemic data from the database
    const [rows] = await db.query(
      "SELECT * FROM predictions ORDER BY updated DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found in the database." });
    }

    // Assuming the first row is the most recent data
    const pandemicData = rows[0];

    // Create a meaningful prompt combining user input and dynamic pandemic data
    const prompt = `
      User input: ${userInput}
      
      Pandemic data summary:
      - Total cases: ${pandemicData.cases}
      - Total deaths: ${pandemicData.deaths}
      - Total recovered: ${pandemicData.recovered}
      - Active cases: ${pandemicData.active}
      - Critical cases: ${pandemicData.critical}
      - Affected countries: ${pandemicData.affected_countries}
      
      Based on this data, make a prediction or provide insights regarding the current pandemic trends.
    `;

    // Set up the GoogleGenerativeAI model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Use the model to generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Check if the result contains the generated response
    if (result && result.response) {
      // Send the generated prediction back to the client
      res.status(200).json({
        prediction: result.response.text(), // Send the prediction result (from GoogleGenerativeAI)
      });
    } else {
      throw new Error("No response from GoogleGenerativeAI.");
    }
  } catch (error) {
    console.error("Error fetching prediction or data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching predictions or data." });
  }
});

module.exports = router;
