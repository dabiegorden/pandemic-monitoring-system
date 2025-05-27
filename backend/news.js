const express = require("express")
const router = express.Router()
const db = require("./db")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
const natural = require("natural")
const stopwords = require("stopwords").english
dotenv.config()

// Initialize Google AI only if API key is available
let genAI = null
try {
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require("@google/generative-ai")
    genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
  }
} catch (error) {
  console.log("Google AI not available, using fallback sentiment analysis")
}

// Create the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Professional AI-powered sentiment analysis with better error handling
const analyzeAdvancedSentiment = async (title, description) => {
  console.log("Starting sentiment analysis for:", title.substring(0, 50) + "...")

  // If Google AI is not available, use enhanced fallback
  if (!genAI) {
    console.log("Google AI not available, using enhanced fallback analysis")
    return getEnhancedFallbackSentiment(title, description)
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
    As a professional sentiment analysis expert specializing in health and pandemic news, analyze the following news article:

    Title: "${title}"
    Description: "${description}"

    Provide a comprehensive sentiment analysis with the following JSON format:
    {
      "sentiment": "positive|negative|neutral|mixed",
      "confidence": 0.0-1.0,
      "emotional_tone": "hopeful|concerning|alarming|informative|reassuring|urgent",
      "severity_level": "low|medium|high|critical",
      "health_impact": "beneficial|neutral|harmful|unknown",
      "public_concern_level": 1-10,
      "key_emotions": ["emotion1", "emotion2"],
      "reasoning": "Brief explanation of the analysis",
      "risk_indicators": ["indicator1", "indicator2"],
      "actionability": "immediate|monitor|routine|none"
    }

    Focus on:
    - Health implications and public safety
    - Emotional impact on readers
    - Urgency and severity of the situation
    - Potential for causing panic or reassurance
    - Scientific accuracy and reliability indicators

    Return only valid JSON without any markdown formatting.
    `

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Clean the response to ensure it's valid JSON
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim()

    try {
      const analysis = JSON.parse(cleanedResponse)
      console.log("AI analysis successful:", analysis.sentiment, analysis.confidence)

      // Validate and set defaults if needed
      return {
        sentiment: analysis.sentiment || "neutral",
        confidence: Math.min(Math.max(analysis.confidence || 0.5, 0), 1),
        emotional_tone: analysis.emotional_tone || "informative",
        severity_level: analysis.severity_level || "medium",
        health_impact: analysis.health_impact || "neutral",
        public_concern_level: Math.min(Math.max(analysis.public_concern_level || 5, 1), 10),
        key_emotions: Array.isArray(analysis.key_emotions) ? analysis.key_emotions : [],
        reasoning: analysis.reasoning || "AI-powered sentiment analysis",
        risk_indicators: Array.isArray(analysis.risk_indicators) ? analysis.risk_indicators : [],
        actionability: analysis.actionability || "routine",
        analysis_timestamp: new Date().toISOString(),
      }
    } catch (parseError) {
      console.error("Error parsing AI sentiment response:", parseError)
      console.log("Raw AI response:", cleanedResponse)
      return getEnhancedFallbackSentiment(title, description)
    }
  } catch (error) {
    console.error("Error in AI sentiment analysis:", error)
    return getEnhancedFallbackSentiment(title, description)
  }
}

// Enhanced fallback sentiment analysis with dynamic results
const getEnhancedFallbackSentiment = (title, description) => {
  const text = `${title} ${description}`.toLowerCase()
  console.log("Using enhanced fallback analysis for:", title.substring(0, 30) + "...")

  // Health-specific positive indicators with weights
  const positiveIndicators = [
    { word: "recovery", weight: 3 },
    { word: "recovered", weight: 3 },
    { word: "healing", weight: 2 },
    { word: "improvement", weight: 2 },
    { word: "breakthrough", weight: 4 },
    { word: "cure", weight: 4 },
    { word: "treatment", weight: 2 },
    { word: "vaccine", weight: 3 },
    { word: "vaccination", weight: 3 },
    { word: "immunity", weight: 3 },
    { word: "prevention", weight: 2 },
    { word: "decline", weight: 3 },
    { word: "decreasing", weight: 3 },
    { word: "better", weight: 2 },
    { word: "progress", weight: 2 },
    { word: "success", weight: 3 },
    { word: "effective", weight: 2 },
    { word: "safe", weight: 2 },
    { word: "approved", weight: 3 },
    { word: "hope", weight: 2 },
    { word: "optimistic", weight: 2 },
    { word: "good news", weight: 4 },
    { word: "promising", weight: 3 },
  ]

  // Health-specific negative indicators with weights
  const negativeIndicators = [
    { word: "outbreak", weight: 4 },
    { word: "pandemic", weight: 4 },
    { word: "epidemic", weight: 4 },
    { word: "death", weight: 5 },
    { word: "deaths", weight: 5 },
    { word: "died", weight: 5 },
    { word: "fatal", weight: 5 },
    { word: "severe", weight: 3 },
    { word: "critical", weight: 4 },
    { word: "emergency", weight: 4 },
    { word: "crisis", weight: 4 },
    { word: "surge", weight: 3 },
    { word: "spike", weight: 3 },
    { word: "increase", weight: 2 },
    { word: "rising", weight: 2 },
    { word: "spreading", weight: 3 },
    { word: "mutation", weight: 3 },
    { word: "variant", weight: 3 },
    { word: "concern", weight: 2 },
    { word: "warning", weight: 3 },
    { word: "alert", weight: 3 },
    { word: "danger", weight: 4 },
    { word: "risk", weight: 2 },
    { word: "threat", weight: 3 },
    { word: "fear", weight: 2 },
    { word: "hospital", weight: 1 },
    { word: "icu", weight: 4 },
    { word: "ventilator", weight: 4 },
  ]

  // Critical health terms that increase concern
  const criticalTerms = [
    "ebola",
    "hemorrhagic",
    "mortality",
    "fatality",
    "contagious",
    "infectious",
    "quarantine",
    "isolation",
    "lockdown",
    "shutdown",
  ]

  let positiveScore = 0
  let negativeScore = 0
  let criticalScore = 0

  // Calculate weighted scores
  positiveIndicators.forEach(({ word, weight }) => {
    const matches = (text.match(new RegExp(word, "g")) || []).length
    positiveScore += matches * weight
  })

  negativeIndicators.forEach(({ word, weight }) => {
    const matches = (text.match(new RegExp(word, "g")) || []).length
    negativeScore += matches * weight
  })

  criticalTerms.forEach((term) => {
    if (text.includes(term)) {
      criticalScore += 3
    }
  })

  // Calculate text length factor (longer articles might be more complex)
  const textLength = text.length
  const lengthFactor = Math.min(textLength / 1000, 1.5) // Cap at 1.5x

  // Determine sentiment based on scores
  let sentiment = "neutral"
  let severity_level = "medium"
  let public_concern_level = 5
  let confidence = 0.6
  let emotional_tone = "informative"
  let health_impact = "neutral"
  let actionability = "routine"

  const totalScore = positiveScore - negativeScore - criticalScore
  const scoreIntensity = Math.abs(totalScore) * lengthFactor

  if (totalScore > 2) {
    sentiment = "positive"
    severity_level = "low"
    public_concern_level = Math.max(1, 5 - Math.floor(scoreIntensity / 2))
    confidence = Math.min(0.9, 0.6 + scoreIntensity / 20)
    emotional_tone = scoreIntensity > 5 ? "hopeful" : "reassuring"
    health_impact = "beneficial"
    actionability = "routine"
  } else if (totalScore < -2 || criticalScore > 0) {
    sentiment = "negative"

    if (criticalScore > 5 || negativeScore > 15) {
      severity_level = "critical"
      public_concern_level = Math.min(10, 7 + Math.floor(scoreIntensity / 3))
      emotional_tone = "alarming"
      actionability = "immediate"
    } else if (negativeScore > 8) {
      severity_level = "high"
      public_concern_level = Math.min(9, 6 + Math.floor(scoreIntensity / 4))
      emotional_tone = "concerning"
      actionability = "monitor"
    } else {
      severity_level = "medium"
      public_concern_level = Math.min(8, 5 + Math.floor(scoreIntensity / 5))
      emotional_tone = "concerning"
      actionability = "monitor"
    }

    confidence = Math.min(0.9, 0.6 + scoreIntensity / 15)
    health_impact = "harmful"
  } else if (positiveScore > 0 && negativeScore > 0) {
    sentiment = "mixed"
    severity_level = "medium"
    public_concern_level = 5 + Math.floor((negativeScore - positiveScore) / 3)
    confidence = Math.min(0.8, 0.5 + scoreIntensity / 25)
    emotional_tone = "informative"
    health_impact = "neutral"
    actionability = "monitor"
  }

  // Ensure values are within bounds
  public_concern_level = Math.min(Math.max(public_concern_level, 1), 10)
  confidence = Math.min(Math.max(confidence, 0.3), 0.95)

  const result = {
    sentiment,
    confidence: Number(confidence.toFixed(2)),
    emotional_tone,
    severity_level,
    health_impact,
    public_concern_level,
    key_emotions:
      sentiment === "positive"
        ? ["hope", "relief", "optimism"]
        : sentiment === "negative"
          ? ["concern", "anxiety", "worry"]
          : ["awareness", "attention"],
    reasoning: `Enhanced keyword analysis: ${positiveScore} positive signals, ${negativeScore} negative signals, ${criticalScore} critical terms. Confidence based on signal strength.`,
    risk_indicators:
      negativeScore > 5
        ? ["high-negative-sentiment", "health-concern-keywords"]
        : criticalScore > 0
          ? ["critical-health-terms"]
          : [],
    actionability,
    analysis_timestamp: new Date().toISOString(),
  }

  console.log("Fallback analysis result:", {
    sentiment: result.sentiment,
    confidence: result.confidence,
    concern_level: result.public_concern_level,
    positive_score: positiveScore,
    negative_score: negativeScore,
    critical_score: criticalScore,
  })

  return result
}

// Enhanced keyword extraction with health-specific processing
const extractAdvancedKeywords = (text) => {
  const tokenizer = new natural.WordTokenizer()

  // Health-specific important terms that should not be filtered
  const healthTerms = [
    "covid",
    "coronavirus",
    "pandemic",
    "epidemic",
    "vaccine",
    "vaccination",
    "virus",
    "bacteria",
    "infection",
    "disease",
    "outbreak",
    "symptoms",
    "treatment",
    "therapy",
    "medicine",
    "hospital",
    "clinic",
    "doctor",
    "patient",
    "health",
    "medical",
    "research",
    "study",
    "trial",
  ]

  const tokens = tokenizer.tokenize(text.toLowerCase())

  const filteredTokens = tokens.filter((token) => {
    return token.length > 2 && /^[a-zA-Z]+$/.test(token) && (!stopwords.includes(token) || healthTerms.includes(token))
  })

  // Count frequencies
  const frequencies = {}
  filteredTokens.forEach((token) => {
    frequencies[token] = (frequencies[token] || 0) + 1
  })

  return Object.entries(frequencies)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50)
}

// Function to send outbreak notifications via email only
const sendOutbreakNotification = async (newsTitle, newsDescription) => {
  try {
    const [users] = await db.query("SELECT email FROM users")

    if (users.length === 0) {
      console.log("No users found to send notifications.")
      return
    }

    const subject = `Health Alert: ${newsTitle}`
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Health Alert</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚨 Health Alert</h1>
          </div>
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #dc2626; margin-top: 0;">${newsTitle}</h2>
            <p style="font-size: 16px; line-height: 1.6;">${newsDescription}</p>
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #dc2626;">Important:</p>
              <p style="margin: 5px 0 0 0;">Please stay informed and follow official health guidelines. Visit our platform for the latest updates and detailed information.</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Full Article</a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>CUG Real-Time Pandemic Monitoring System</p>
          </div>
        </div>
      </body>
      </html>
    `

    for (const user of users) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: subject,
        html: html,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Health alert email sent to ${user.email}`)
    }
  } catch (error) {
    console.error("Error sending health alert emails:", error)
  }
}

// Fetch all news with pagination and enhanced data
router.get("/", async (req, res) => {
  const searchQuery = req.query.query
  const page = Number.parseInt(req.query.page) || 1
  const limit = Number.parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  let query
  let countQuery
  let queryParams = []

  try {
    if (searchQuery) {
      query = `
        SELECT * FROM news 
        WHERE title LIKE ? OR description LIKE ?
        ORDER BY date DESC, time DESC
        LIMIT ? OFFSET ?
      `
      countQuery = `
        SELECT COUNT(*) as total FROM news 
        WHERE title LIKE ? OR description LIKE ?
      `
      queryParams = [`%${searchQuery}%`, `%${searchQuery}%`]
    } else {
      query = `
        SELECT * FROM news 
        ORDER BY date DESC, time DESC 
        LIMIT ? OFFSET ?
      `
      countQuery = "SELECT COUNT(*) as total FROM news"
    }

    // Get total count for pagination
    const [countResult] = await db.query(countQuery, queryParams)
    const totalItems = countResult[0].total
    const totalPages = Math.ceil(totalItems / limit)

    // Get paginated results
    const [rows] = await db.query(query, [...queryParams, limit, offset])

    // Process sentiment_analysis JSON for each row
    const processedRows = rows.map((row) => {
      if (row.sentiment_analysis) {
        try {
          row.sentiment_analysis = JSON.parse(row.sentiment_analysis)
        } catch (e) {
          console.error("Error parsing sentiment_analysis JSON:", e)
          row.sentiment_analysis = null
        }
      }
      return row
    })

    res.status(200).json({
      data: processedRows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error retrieving news:", error)
    res.status(500).json({ error: "An error occurred while retrieving news", details: error.message })
  }
})

// Enhanced sentiment trends endpoint
router.get("/trends/sentiment", async (req, res) => {
  const { startDate, endDate } = req.query

  let query
  let queryParams = []

  try {
    if (startDate && endDate) {
      query = `
        SELECT 
          date,
          COUNT(*) as total_count,
          COUNT(CASE WHEN sentiment_classification = 'positive' THEN 1 END) as positive_count,
          COUNT(CASE WHEN sentiment_classification = 'neutral' THEN 1 END) as neutral_count,
          COUNT(CASE WHEN sentiment_classification = 'negative' THEN 1 END) as negative_count,
          COUNT(CASE WHEN sentiment_classification = 'mixed' THEN 1 END) as mixed_count
        FROM news 
        WHERE date BETWEEN ? AND ?
        GROUP BY date
        ORDER BY date DESC
      `
      queryParams = [startDate, endDate]
    } else {
      query = `
        SELECT 
          date,
          COUNT(*) as total_count,
          COUNT(CASE WHEN sentiment_classification = 'positive' THEN 1 END) as positive_count,
          COUNT(CASE WHEN sentiment_classification = 'neutral' THEN 1 END) as neutral_count,
          COUNT(CASE WHEN sentiment_classification = 'negative' THEN 1 END) as negative_count,
          COUNT(CASE WHEN sentiment_classification = 'mixed' THEN 1 END) as mixed_count
        FROM news 
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY date
        ORDER BY date DESC
      `
    }

    const [dailyTrends] = await db.query(query, queryParams)

    // Get overall statistics
    const totalNews = dailyTrends.reduce((sum, day) => sum + day.total_count, 0)
    const totalPositive = dailyTrends.reduce((sum, day) => sum + day.positive_count, 0)
    const totalNegative = dailyTrends.reduce((sum, day) => sum + day.negative_count, 0)
    const totalNeutral = dailyTrends.reduce((sum, day) => sum + day.neutral_count, 0)
    const totalMixed = dailyTrends.reduce((sum, day) => sum + day.mixed_count, 0)

    // Get top keywords from recent articles
    const keywordQuery =
      startDate && endDate
        ? "SELECT title, description FROM news WHERE date BETWEEN ? AND ?"
        : "SELECT title, description FROM news WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)"

    const [articles] = await db.query(keywordQuery, queryParams)
    const allText = articles.map((article) => `${article.title} ${article.description}`).join(" ")
    const keywords = extractAdvancedKeywords(allText)

    const overallSentiment = {
      total_news: totalNews,
      positive_percentage: totalNews > 0 ? ((totalPositive / totalNews) * 100).toFixed(2) : 0,
      negative_percentage: totalNews > 0 ? ((totalNegative / totalNews) * 100).toFixed(2) : 0,
      neutral_percentage: totalNews > 0 ? ((totalNeutral / totalNews) * 100).toFixed(2) : 0,
      mixed_percentage: totalNews > 0 ? ((totalMixed / totalNews) * 100).toFixed(2) : 0,
      trend_direction: "stable",
    }

    res.status(200).json({
      daily_trends: dailyTrends,
      overall_sentiment: overallSentiment,
      top_keywords: keywords.slice(0, 20),
      analysis_metadata: {
        ai_powered: !!genAI,
        confidence_threshold: 0.7,
        last_updated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error retrieving sentiment trends:", error)
    res.status(500).json({ error: "An error occurred while retrieving sentiment trends", details: error.message })
  }
})

// Fetch a single news item by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const query = "SELECT * FROM news WHERE id = ?"
    const [rows] = await db.query(query, [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: "News item not found" })
    }

    // Parse sentiment_analysis JSON if it exists
    if (rows[0].sentiment_analysis) {
      try {
        rows[0].sentiment_analysis = JSON.parse(rows[0].sentiment_analysis)
      } catch (e) {
        console.error("Error parsing sentiment_analysis JSON:", e)
        rows[0].sentiment_analysis = null
      }
    }

    res.status(200).json(rows[0])
  } catch (error) {
    console.error("Error retrieving news item:", error)
    res.status(500).json({ error: "An error occurred while retrieving the news item", details: error.message })
  }
})

// Add a new news item with advanced sentiment analysis
router.post("/", async (req, res) => {
  const { title, description, image_url, date, time, read_more } = req.body

  if (!title || !description || !image_url || !date || !time || !read_more) {
    return res.status(400).json({ error: "All fields are required" })
  }

  try {
    console.log("Processing new article:", title.substring(0, 50) + "...")

    // Perform advanced sentiment analysis
    const sentimentResult = await analyzeAdvancedSentiment(title, description)
    console.log("Sentiment analysis completed:", sentimentResult)

    // Extract keywords
    const keywords = extractAdvancedKeywords(`${title} ${description}`)

    // Check if the table has the new columns, if not, use basic insert
    const query = `
      INSERT INTO news (
        title, description, image_url, date, time, read_more, 
        sentiment_classification, sentiment_analysis, keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await db.execute(query, [
      title,
      description,
      image_url,
      date,
      time,
      read_more,
      sentimentResult.sentiment,
      JSON.stringify(sentimentResult),
      JSON.stringify(keywords),
    ])

    if (result.affectedRows > 0) {
      console.log(
        "News added successfully with sentiment:",
        sentimentResult.sentiment,
        "concern:",
        sentimentResult.public_concern_level,
      )

      // Send notifications based on severity
      if (sentimentResult.severity_level === "critical" || sentimentResult.public_concern_level >= 8) {
        console.log("Sending outbreak notification due to high severity/concern")
        await sendOutbreakNotification(title, description)
      }

      return res.status(201).json({
        id: result.insertId,
        sentiment: sentimentResult,
        keywords: keywords.slice(0, 10),
        message: "News added successfully with AI-powered sentiment analysis!",
      })
    } else {
      return res.status(400).json({ error: "Failed to add news." })
    }
  } catch (error) {
    console.error("Error adding news:", error)
    res.status(500).json({ error: "An error occurred while adding news", details: error.message })
  }
})

module.exports = router
