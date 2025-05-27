const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const axios = require("axios"); // Use axios for HTTP requests

dotenv.config();

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Endpoint to get AI predictions based on live COVID-19 data
router.post("/", async (req, res) => {
  const { userInput } = req.body;

  try {
    // Fetch live COVID-19 data from disease.sh API
    const response = await axios.get("https://disease.sh/v3/covid-19/countries");
    const countriesData = response.data;

    if (!Array.isArray(countriesData) || countriesData.length === 0) {
      return res.status(500).json({ error: "Failed to fetch data from external API." });
    }

    // Optional: Extract summary stats from the dataset
    const totalCases = countriesData.reduce((acc, c) => acc + c.cases, 0);
    const totalDeaths = countriesData.reduce((acc, c) => acc + c.deaths, 0);
    const totalRecovered = countriesData.reduce((acc, c) => acc + c.recovered, 0);
    const activeCases = countriesData.reduce((acc, c) => acc + c.active, 0);
    const criticalCases = countriesData.reduce((acc, c) => acc + c.critical, 0);
    const affectedCountries = countriesData.length;

    // Create a meaningful prompt with this data
    const prompt = `
User input: ${userInput}

Global COVID-19 Summary:
- Total cases: ${totalCases.toLocaleString()}
- Total deaths: ${totalDeaths.toLocaleString()}
- Total recovered: ${totalRecovered.toLocaleString()}
- Active cases: ${activeCases.toLocaleString()}
- Critical cases: ${criticalCases.toLocaleString()}
- Affected countries: ${affectedCountries}

Based on this real-time data, provide an analysis or prediction regarding the ongoing COVID-19 pandemic and its potential global impact.
`;

    // Generate AI prediction
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    if (result && result.response) {
      res.status(200).json({
        prediction: result.response.text()
      });
    } else {
      throw new Error("No response from GoogleGenerativeAI.");
    }
  } catch (error) {
    console.error("Error during AI prediction:", error.message);
    res.status(500).json({
      error: "An error occurred while generating the prediction."
    });
  }
});

module.exports = router;
