const db = require("./db")
const natural = require("natural")
const stopwords = require("stopwords").english
const dotenv = require("dotenv")
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

// Enhanced fallback sentiment analysis with dynamic results (same as in news.js)
const getEnhancedFallbackSentiment = (title, description) => {
  const text = `${title} ${description}`.toLowerCase()
  console.log("Analyzing:", title.substring(0, 50) + "...")

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
    { word: "reduced", weight: 2 },
    { word: "lower", weight: 2 },
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
    { word: "quarantine", weight: 3 },
    { word: "lockdown", weight: 3 },
  ]

  // Critical health terms that increase concern
  const criticalTerms = [
    "ebola",
    "hemorrhagic",
    "mortality",
    "fatality",
    "contagious",
    "infectious",
    "isolation",
    "shutdown",
    "overwhelmed",
    "collapse",
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

  // Calculate text length factor
  const textLength = text.length
  const lengthFactor = Math.min(textLength / 1000, 1.5)

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

  // Add some randomization to make results more varied
  const randomFactor = (Math.random() - 0.5) * 0.1 // ±5% variation
  confidence = Math.min(Math.max(confidence + randomFactor, 0.3), 0.95)

  // Slight variation in concern level
  if (sentiment !== "positive") {
    public_concern_level = Math.min(Math.max(public_concern_level + Math.floor((Math.random() - 0.5) * 2), 1), 10)
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
    reasoning: `Enhanced analysis: ${positiveScore} positive signals, ${negativeScore} negative signals, ${criticalScore} critical terms detected.`,
    risk_indicators:
      negativeScore > 5
        ? ["high-negative-sentiment", "health-concern-keywords"]
        : criticalScore > 0
          ? ["critical-health-terms"]
          : [],
    actionability,
    analysis_timestamp: new Date().toISOString(),
  }

  console.log(
    `Result: ${result.sentiment} (${result.confidence * 100}% confident, ${result.public_concern_level}/10 concern)`,
  )

  return result
}

// Professional AI-powered sentiment analysis
const analyzeAdvancedSentiment = async (title, description) => {
  // If Google AI is not available, use enhanced fallback
  if (!genAI) {
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

    const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim()

    try {
      const analysis = JSON.parse(cleanedResponse)

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
      return getEnhancedFallbackSentiment(title, description)
    }
  } catch (error) {
    console.error("Error in AI sentiment analysis:", error)
    return getEnhancedFallbackSentiment(title, description)
  }
}

// Enhanced keyword extraction
const extractAdvancedKeywords = (text) => {
  const tokenizer = new natural.WordTokenizer()

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

  const frequencies = {}
  filteredTokens.forEach((token) => {
    frequencies[token] = (frequencies[token] || 0) + 1
  })

  return Object.entries(frequencies)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50)
}

// Main function to update all existing news articles
async function updateAllNewsSentiment() {
  try {
    console.log("🚀 Starting sentiment analysis update for all news articles...")

    // Get all news articles
    const [articles] = await db.query("SELECT id, title, description FROM news ORDER BY id")

    console.log(`📊 Found ${articles.length} articles to analyze`)

    let updatedCount = 0
    let errorCount = 0

    for (const article of articles) {
      try {
        console.log(`\n📝 Processing article ${article.id}: ${article.title.substring(0, 50)}...`)

        // Perform sentiment analysis
        const sentimentResult = await analyzeAdvancedSentiment(article.title, article.description)

        // Extract keywords
        const keywords = extractAdvancedKeywords(`${article.title} ${article.description}`)

        // Update the database
        const updateQuery = `
          UPDATE news 
          SET 
            sentiment_classification = ?,
            sentiment_analysis = ?,
            keywords = ?
          WHERE id = ?
        `

        await db.execute(updateQuery, [
          sentimentResult.sentiment,
          JSON.stringify(sentimentResult),
          JSON.stringify(keywords),
          article.id,
        ])

        console.log(
          `✅ Updated article ${article.id}: ${sentimentResult.sentiment} (${Math.round(sentimentResult.confidence * 100)}% confident, ${sentimentResult.public_concern_level}/10 concern)`,
        )
        updatedCount++

        // Add a small delay to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`❌ Error updating article ${article.id}:`, error.message)
        errorCount++
      }
    }

    console.log(`\n🎉 Update completed!`)
    console.log(`✅ Successfully updated: ${updatedCount} articles`)
    console.log(`❌ Errors: ${errorCount} articles`)
    console.log(`📊 Total processed: ${articles.length} articles`)
  } catch (error) {
    console.error("💥 Fatal error during update:", error)
  } finally {
    // Close database connection
    process.exit(0)
  }
}

// Run the update
updateAllNewsSentiment()
