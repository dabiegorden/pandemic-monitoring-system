const express = require("express");
const router = express.Router();
const db = require("./db");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const natural = require("natural");
const stopwords = require("stopwords").english;
const { sendBulkNewsNotifications } = require("./sms-service");
dotenv.config();

// Create the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send outbreak notifications dynamically based on the news type
const sendOutbreakNotification = async (newsTitle, newsDescription) => {
  try {
    // Fetch all users' emails from the database
    const [users] = await db.query("SELECT email FROM users");

    // If no users are found, log and return
    if (users.length === 0) {
      console.log("No users found to send notifications.");
      return;
    }

    // Prepare email content dynamically based on the news
    const subject = `Important Update: ${newsTitle}`;
    const text = `Dear User,\n\nA new outbreak or health update has been reported.\n\nTitle: ${newsTitle}\nDescription: ${newsDescription}\n\nPlease stay alert and take necessary precautions.\n\nStay safe!`;

    // Loop through all users and send an email to each one
    for (const user of users) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: subject,
        text: text,
      };

      // Send email (Assuming transporter is already configured)
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.email}`);
    }
  } catch (error) {
    console.error("Error sending outbreak notification emails:", error);
  }
};

// Function to analyze sentiment of news content
const analyzeSentiment = (title, description) => {
  // Analyze both title and description for more accurate sentiment
  const combinedText = `${title} ${description}`;
  const result = sentiment.analyze(combinedText);

  // Return sentiment score and classification
  return {
    score: result.score,
    comparative: result.comparative,
    classification:
      result.score > 0 ? "positive" : result.score < 0 ? "negative" : "neutral",
  };
};

// Function to extract keywords from text
const extractKeywords = (text) => {
  // Tokenize the text
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());

  // Remove stopwords and short words
  const filteredTokens = tokens.filter(
    (token) =>
      token.length > 3 &&
      !stopwords.includes(token) &&
      /^[a-zA-Z]+$/.test(token) // Only include alphabetic words
  );

  // Count word frequencies
  const wordFrequencies = {};
  filteredTokens.forEach((token) => {
    wordFrequencies[token] = (wordFrequencies[token] || 0) + 1;
  });

  // Convert to array and sort by frequency
  const sortedWords = Object.entries(wordFrequencies)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count);

  return sortedWords.slice(0, 30); // Return top 30 keywords
};

// Define topic categories and their related keywords
const topicKeywords = {
  "COVID-19": ["covid", "coronavirus", "pandemic", "virus", "omicron", "delta"],
  Vaccination: [
    "vaccine",
    "vaccination",
    "booster",
    "immunization",
    "doses",
    "pfizer",
    "moderna",
  ],
  Treatment: [
    "treatment",
    "therapy",
    "medication",
    "drug",
    "cure",
    "antibiotics",
    "antiviral",
  ],
  Prevention: [
    "prevention",
    "protect",
    "mask",
    "distance",
    "hygiene",
    "sanitizer",
  ],
  Research: [
    "research",
    "study",
    "trial",
    "clinical",
    "scientists",
    "laboratory",
    "experiment",
  ],
  "Public Health": [
    "public",
    "community",
    "population",
    "global",
    "world",
    "national",
    "international",
  ],
  Healthcare: [
    "hospital",
    "clinic",
    "doctor",
    "nurse",
    "medical",
    "healthcare",
    "patient",
  ],
  "Mental Health": [
    "mental",
    "anxiety",
    "depression",
    "stress",
    "psychological",
    "therapy",
  ],
  Nutrition: [
    "nutrition",
    "diet",
    "food",
    "eating",
    "vitamin",
    "mineral",
    "supplement",
  ],
  Exercise: [
    "exercise",
    "fitness",
    "physical",
    "activity",
    "workout",
    "training",
  ],
};

// Function to identify topics from keywords
const identifyTopics = (keywords) => {
  // Count keyword occurrences for each topic
  const topicCounts = {};

  // Initialize all topics with zero count
  Object.keys(topicKeywords).forEach((topic) => {
    topicCounts[topic] = 0;
  });

  // Count keywords for each topic
  keywords.forEach(({ keyword, count }) => {
    Object.entries(topicKeywords).forEach(([topic, relatedKeywords]) => {
      if (
        relatedKeywords.some(
          (related) => keyword.includes(related) || related.includes(keyword)
        )
      ) {
        topicCounts[topic] += count;
      }
    });
  });

  // Convert to array and sort by count
  return Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
};

// Fetch all news (sorted by date and time) or perform a search
router.get("/", async (req, res) => {
  const searchQuery = req.query.query; // Get the search query from request parameters

  let query;
  let queryParams = [];

  if (searchQuery) {
    // If a search query is provided, search by title or description
    query = `
      SELECT * FROM news 
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY date DESC, time DESC
    `;
    queryParams = [`%${searchQuery}%`, `%${searchQuery}%`];
  } else {
    // If no search query, fetch all news items
    query = "SELECT * FROM news ORDER BY date DESC, time DESC";
  }

  try {
    const [rows] = await db.query(query, queryParams); // Execute query
    if (rows.length === 0) {
      // If no news items are found, return a 404 error
      return res.status(404).json({ error: "News item not found" });
    }
    res.status(200).json(rows); // Send the news items as a JSON response
  } catch (error) {
    console.error("Error retrieving news:", error);
    res.status(500).json({ error: "An error occurred while retrieving news" });
  }
});

// Get sentiment trends for news
router.get("/trends/sentiment", async (req, res) => {
  // Get optional date range parameters
  const { startDate, endDate } = req.query;

  let query;
  let queryParams = [];

  if (startDate && endDate) {
    query = `
      SELECT 
        date, 
        AVG(sentiment_score) as average_sentiment,
        COUNT(CASE WHEN sentiment_classification = 'positive' THEN 1 END) as positive_count,
        COUNT(CASE WHEN sentiment_classification = 'neutral' THEN 1 END) as neutral_count,
        COUNT(CASE WHEN sentiment_classification = 'negative' THEN 1 END) as negative_count,
        COUNT(*) as total_count
      FROM news 
      WHERE date BETWEEN ? AND ?
      GROUP BY date
      ORDER BY date DESC
    `;
    queryParams = [startDate, endDate];
  } else {
    // If no date range, get trends for the last 30 days
    query = `
      SELECT 
        date, 
        AVG(sentiment_score) as average_sentiment,
        COUNT(CASE WHEN sentiment_classification = 'positive' THEN 1 END) as positive_count,
        COUNT(CASE WHEN sentiment_classification = 'neutral' THEN 1 END) as neutral_count,
        COUNT(CASE WHEN sentiment_classification = 'negative' THEN 1 END) as negative_count,
        COUNT(*) as total_count
      FROM news 
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY date
      ORDER BY date DESC
    `;
  }

  try {
    // Get daily sentiment trends
    const [dailyTrends] = await db.query(query, queryParams);

    // Get all news articles in the date range for keyword analysis
    let newsQuery;
    if (startDate && endDate) {
      newsQuery = `
        SELECT id, title, description, sentiment_classification 
        FROM news 
        WHERE date BETWEEN ? AND ?
      `;
    } else {
      newsQuery = `
        SELECT id, title, description, sentiment_classification 
        FROM news 
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      `;
    }

    const [newsArticles] = await db.query(newsQuery, queryParams);

    // Extract keywords from all news articles
    const allText = newsArticles
      .map((article) => `${article.title} ${article.description}`)
      .join(" ");
    const keywords = extractKeywords(allText);

    // Identify topics from keywords
    const topics = identifyTopics(keywords);

    // Calculate keyword sentiment
    const keywordSentiment = {};
    keywords.slice(0, 15).forEach((keyword) => {
      const keywordArticles = newsArticles.filter((article) =>
        (article.title + " " + article.description)
          .toLowerCase()
          .includes(keyword.keyword)
      );

      const total = keywordArticles.length;
      const positive = keywordArticles.filter(
        (a) => a.sentiment_classification === "positive"
      ).length;
      const negative = keywordArticles.filter(
        (a) => a.sentiment_classification === "negative"
      ).length;
      const neutral = total - positive - negative;

      keywordSentiment[keyword.keyword] = {
        total,
        positive,
        negative,
        neutral,
        positivePercentage: total > 0 ? (positive / total) * 100 : 0,
        neutralPercentage: total > 0 ? (neutral / total) * 100 : 0,
        negativePercentage: total > 0 ? (negative / total) * 100 : 0,
        dominantSentiment:
          positive > negative && positive > neutral
            ? "positive"
            : negative > positive && negative > neutral
            ? "negative"
            : "neutral",
      };
    });

    // Calculate topic sentiment
    const topicSentiment = {};
    topics.slice(0, 6).forEach((topicItem) => {
      const topicKeywordList = Object.entries(topicKeywords).find(
        ([topic]) => topic === topicItem.topic
      )[1];

      const topicArticles = newsArticles.filter((article) => {
        const text = (article.title + " " + article.description).toLowerCase();
        return topicKeywordList.some((keyword) => text.includes(keyword));
      });

      const total = topicArticles.length;
      const positive = topicArticles.filter(
        (a) => a.sentiment_classification === "positive"
      ).length;
      const negative = topicArticles.filter(
        (a) => a.sentiment_classification === "negative"
      ).length;
      const neutral = total - positive - negative;

      topicSentiment[topicItem.topic] = {
        total,
        positive,
        negative,
        neutral,
        positivePercentage: total > 0 ? (positive / total) * 100 : 0,
        neutralPercentage: total > 0 ? (neutral / total) * 100 : 0,
        negativePercentage: total > 0 ? (negative / total) * 100 : 0,
        dominantSentiment:
          positive > negative && positive > neutral
            ? "positive"
            : negative > positive && negative > neutral
            ? "negative"
            : "neutral",
      };
    });

    // Calculate overall sentiment statistics
    const totalNews = dailyTrends.reduce(
      (sum, day) => sum + day.total_count,
      0
    );
    const totalPositive = dailyTrends.reduce(
      (sum, day) => sum + day.positive_count,
      0
    );
    const totalNegative = dailyTrends.reduce(
      (sum, day) => sum + day.negative_count,
      0
    );
    const totalNeutral = dailyTrends.reduce(
      (sum, day) => sum + day.neutral_count,
      0
    );

    const overallSentiment = {
      total_news: totalNews,
      positive_percentage:
        totalNews > 0 ? ((totalPositive / totalNews) * 100).toFixed(2) : 0,
      negative_percentage:
        totalNews > 0 ? ((totalNegative / totalNews) * 100).toFixed(2) : 0,
      neutral_percentage:
        totalNews > 0 ? ((totalNeutral / totalNews) * 100).toFixed(2) : 0,
      trend_direction:
        dailyTrends.length > 1
          ? dailyTrends[0].average_sentiment >
            dailyTrends[dailyTrends.length - 1].average_sentiment
            ? "improving"
            : dailyTrends[0].average_sentiment <
              dailyTrends[dailyTrends.length - 1].average_sentiment
            ? "worsening"
            : "stable"
          : "insufficient data",
    };

    res.status(200).json({
      daily_trends: dailyTrends,
      overall_sentiment: overallSentiment,
      top_keywords: keywords.slice(0, 15),
      top_topics: topics.slice(0, 6),
      keyword_sentiment: keywordSentiment,
      topic_sentiment: topicSentiment,
    });
  } catch (error) {
    console.error("Error retrieving sentiment trends:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving sentiment trends" });
  }
});

// Fetch a single news item by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Get the news ID from the route parameters
  const query = "SELECT * FROM news WHERE id = ?";

  try {
    const [rows] = await db.query(query, [id]); // Query the database with the ID
    if (rows.length === 0) {
      // If no news item is found, return a 404 error
      return res.status(404).json({ error: "News item not found" });
    }

    res.status(200).json(rows[0]); // Send the news item as a JSON response
  } catch (error) {
    console.error("Error retrieving news item:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the news item" });
  }
});

// Add a new news item
router.post("/", async (req, res) => {
  const { title, description, image_url, date, time, read_more } = req.body;

  // Validate required fields
  if (!title || !description || !image_url || !date || !time || !read_more) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Analyze sentiment of the news content
  const sentimentResult = analyzeSentiment(title, description);

  const query =
    "INSERT INTO news (title, description, image_url, date, time, read_more, sentiment_score, sentiment_comparative, sentiment_classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    const [result] = await db.execute(query, [
      title,
      description,
      image_url,
      date,
      time,
      read_more,
      sentimentResult.score,
      sentimentResult.comparative,
      sentimentResult.classification,
    ]);

    // If news is added successfully, trigger notifications
    if (result.affectedRows > 0) {
      console.log("News added successfully, sending notifications...");

      // Fetch all users with phone numbers for SMS notifications
      const [usersWithPhones] = await db.query(
        "SELECT id, name, email, phone_number FROM users WHERE phone_number IS NOT NULL"
      );

      // Send SMS notifications to all users with phone numbers
      if (usersWithPhones.length > 0) {
        await sendBulkNewsNotifications(usersWithPhones, title, description);
        console.log(
          `SMS notifications sent to ${usersWithPhones.length} users`
        );
      }

      // Trigger the email notifications to all users (keep existing email functionality)
      await sendOutbreakNotification(title, description);

      // Send success response
      return res.status(201).json({
        id: result.insertId,
        sentiment: sentimentResult,
        message: `News added successfully! Notifications sent via email and SMS to ${usersWithPhones.length} users.`,
      });
    } else {
      return res.status(400).json({ error: "Failed to add news." });
    }
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(500).json({ error: "An error occurred while adding news" });
  }
});

module.exports = router;
