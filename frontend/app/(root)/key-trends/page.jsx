"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function KeyTrendsPage() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("30");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchTrends(timePeriod);
  }, [timePeriod]);

  const fetchTrends = async (period) => {
    try {
      setLoading(true);
      // Updated API URL to use the new sentiment trends endpoint
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - Number.parseInt(period));

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = today.toISOString().split("T")[0];

      const response = await fetch(
        `http://localhost:5000/api/news/trends/sentiment?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );

      if (!response.ok) throw new Error("Failed to fetch trends data");
      const data = await response.json();

      // Transform the data to match the expected format in the UI
      const transformedData = transformApiData(data, Number.parseInt(period));
      setTrends(transformedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Transform the API data to match the expected format in the UI
  const transformApiData = (apiData, periodDays) => {
    if (!apiData || !apiData.daily_trends || !apiData.overall_sentiment) {
      return null;
    }

    const {
      daily_trends,
      overall_sentiment,
      top_keywords,
      keyword_sentiment,
      topic_sentiment,
    } = apiData;

    // Calculate total news count
    const totalNewsCount = overall_sentiment.total_news || 0;

    // Calculate sentiment percentages
    const sentimentPercentages = {
      positive: Number.parseFloat(overall_sentiment.positive_percentage) || 0,
      neutral: Number.parseFloat(overall_sentiment.neutral_percentage) || 0,
      negative: Number.parseFloat(overall_sentiment.negative_percentage) || 0,
    };

    // Transform daily trends data
    const sentimentTrends = daily_trends.map((day) => ({
      date: day.date,
      total: day.total_count,
      positive: day.positive_count,
      neutral: day.neutral_count,
      negative: day.negative_count,
      positivePercentage: (day.positive_count / day.total_count) * 100 || 0,
      neutralPercentage: (day.neutral_count / day.total_count) * 100 || 0,
      negativePercentage: (day.negative_count / day.total_count) * 100 || 0,
    }));

    // Calculate overall sentiment counts
    const overallSentiment = {
      positive: Math.round(
        (sentimentPercentages.positive / 100) * totalNewsCount
      ),
      neutral: Math.round(
        (sentimentPercentages.neutral / 100) * totalNewsCount
      ),
      negative: Math.round(
        (sentimentPercentages.negative / 100) * totalNewsCount
      ),
    };

    // Transform keyword data
    const topKeywords = top_keywords
      ? top_keywords.map((k) => ({
          keyword: k.keyword,
          count: k.count,
        }))
      : [];

    // Transform keyword sentiment data
    const keywordSentiment = keyword_sentiment || {};

    return {
      totalNewsCount,
      periodDays,
      sentimentPercentages,
      sentimentTrends,
      overallSentiment,
      topKeywords,
      keywordSentiment,
      topicSentiment: topic_sentiment || {},
      trendDirection: overall_sentiment.trend_direction,
    };
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-300";
      case "negative":
        return "bg-red-100 text-red-800 border-red-300";
      case "neutral":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const renderSentimentChart = () => {
    if (!trends) return null;

    const { sentimentPercentages } = trends;

    return (
      <div className="relative pt-1 mt-4">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
              Positive ({sentimentPercentages.positive.toFixed(1)}%)
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Neutral ({sentimentPercentages.neutral.toFixed(1)}%)
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
              Negative ({sentimentPercentages.negative.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="flex h-4 mb-4 overflow-hidden rounded-full">
          <div
            style={{ width: `${sentimentPercentages.positive}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
          ></div>
          <div
            style={{ width: `${sentimentPercentages.neutral}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
          <div
            style={{ width: `${sentimentPercentages.negative}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
          ></div>
        </div>
      </div>
    );
  };

  const renderTrendChart = () => {
    if (!trends?.sentimentTrends || trends.sentimentTrends.length === 0)
      return (
        <div className="text-center py-8 text-gray-500">
          No trend data available for this period
        </div>
      );

    // Ensure trends are sorted by date
    const sortedTrends = [...trends.sentimentTrends].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Calculate max value for scaling
    const maxValue = Math.max(...sortedTrends.map((t) => t.total));

    return (
      <div className="mt-6 relative h-64">
        <div className="absolute inset-0 flex items-end">
          {sortedTrends.map((day, index) => {
            const positiveHeight = (day.positive / maxValue) * 100;
            const neutralHeight = (day.neutral / maxValue) * 100;
            const negativeHeight = (day.negative / maxValue) * 100;

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col-reverse items-center mx-1 group cursor-pointer"
                title={`${new Date(day.date).toLocaleDateString()}: ${
                  day.total
                } news items`}
              >
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left absolute bottom-0 left-0">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded py-1 px-2 right-0 transform scale-0 group-hover:scale-100 transition-transform origin-bottom z-10 w-48">
                  <p className="font-bold">
                    {new Date(day.date).toLocaleDateString()}
                  </p>
                  <p>Total: {day.total} news items</p>
                  <p>
                    Positive: {day.positive} (
                    {day.positivePercentage.toFixed(1)}%)
                  </p>
                  <p>
                    Neutral: {day.neutral} ({day.neutralPercentage.toFixed(1)}%)
                  </p>
                  <p>
                    Negative: {day.negative} (
                    {day.negativePercentage.toFixed(1)}%)
                  </p>
                </div>

                {/* Stack of bars */}
                <div className="flex flex-col w-full">
                  <div
                    className="bg-green-500 w-full rounded-t"
                    style={{ height: `${positiveHeight}%` }}
                  />
                  <div
                    className="bg-blue-500 w-full"
                    style={{ height: `${neutralHeight}%` }}
                  />
                  <div
                    className="bg-red-500 w-full rounded-b"
                    style={{ height: `${negativeHeight}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderKeywordCloud = () => {
    if (!trends?.topKeywords || trends.topKeywords.length === 0)
      return (
        <div className="text-center py-8 text-gray-500">
          No keyword data available
        </div>
      );

    // Find the max count to scale font sizes
    const maxCount = Math.max(...trends.topKeywords.map((k) => k.count));

    return (
      <div className="flex flex-wrap justify-center gap-2 py-4">
        {trends.topKeywords.map((keyword, index) => {
          // Scale font size between 0.8rem and 1.8rem based on frequency
          const fontSize = 0.8 + (keyword.count / maxCount) * 1;

          // Get sentiment for this keyword if available
          const keywordSentiment = trends.keywordSentiment[keyword.keyword];
          let colorClass = "bg-gray-100 text-gray-800 border-gray-300";

          if (keywordSentiment) {
            if (keywordSentiment.dominantSentiment === "positive") {
              colorClass = "bg-green-100 text-green-800 border-green-300";
            } else if (keywordSentiment.dominantSentiment === "negative") {
              colorClass = "bg-red-100 text-red-800 border-red-300";
            } else {
              colorClass = "bg-blue-100 text-blue-800 border-blue-300";
            }
          }

          return (
            <span
              key={keyword.keyword}
              className={`px-3 py-1 rounded-full border ${colorClass}`}
              style={{ fontSize: `${fontSize}rem` }}
            >
              {keyword.keyword} ({keyword.count})
            </span>
          );
        })}
      </div>
    );
  };

  // Render topic sentiment distribution
  const renderTopicSentimentDistribution = () => {
    if (
      !trends?.topicSentiment ||
      Object.keys(trends.topicSentiment).length === 0
    )
      return (
        <div className="text-center py-8 text-gray-500">
          No topic sentiment data available
        </div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(trends.topicSentiment).map(([topic, sentiments]) => (
          <Card key={topic} className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-4 mb-4 overflow-hidden rounded-full">
                <div
                  style={{ width: `${sentiments.positivePercentage}%` }}
                  className="bg-green-500"
                  title={`Positive: ${sentiments.positivePercentage.toFixed(
                    1
                  )}%`}
                ></div>
                <div
                  style={{ width: `${sentiments.neutralPercentage}%` }}
                  className="bg-blue-500"
                  title={`Neutral: ${sentiments.neutralPercentage.toFixed(1)}%`}
                ></div>
                <div
                  style={{ width: `${sentiments.negativePercentage}%` }}
                  className="bg-red-500"
                  title={`Negative: ${sentiments.negativePercentage.toFixed(
                    1
                  )}%`}
                ></div>
              </div>
              <div className="text-sm">
                <span className="inline-block w-3 h-3 bg-green-500 mr-1"></span>
                {sentiments.positivePercentage.toFixed(1)}%
                <span className="inline-block w-3 h-3 bg-blue-500 mx-1 ml-2"></span>
                {sentiments.neutralPercentage.toFixed(1)}%
                <span className="inline-block w-3 h-3 bg-red-500 mx-1 ml-2"></span>
                {sentiments.negativePercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Based on {sentiments.total} articles
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-3/4 h-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="w-full h-64" />
        <Skeleton className="w-full h-64" />
        <Skeleton className="w-full h-64" />
      </div>
      <Skeleton className="w-full h-64" />
      <div className="flex flex-wrap gap-2">
        {[...Array(20)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );

  // Custom Tab Button Component
  const TabButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-800 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    Positive News
                  </CardTitle>
                  <CardDescription>
                    News with a positive sentiment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {trends?.overallSentiment?.positive || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {trends?.sentimentPercentages?.positive.toFixed(1) || 0}% of
                    total
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    Neutral News
                  </CardTitle>
                  <CardDescription>
                    News with a neutral sentiment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {trends?.overallSentiment?.neutral || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {trends?.sentimentPercentages?.neutral.toFixed(1) || 0}% of
                    total
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    Negative News
                  </CardTitle>
                  <CardDescription>
                    News with a negative sentiment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {trends?.overallSentiment?.negative || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {trends?.sentimentPercentages?.negative.toFixed(1) || 0}% of
                    total
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Overall Sentiment Distribution</CardTitle>
                <CardDescription>
                  Sentiment breakdown of {trends?.totalNewsCount || 0} news
                  items from the past {trends?.periodDays || 30} days
                </CardDescription>
              </CardHeader>
              <CardContent>{renderSentimentChart()}</CardContent>
            </Card>

            {trends?.trendDirection && (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Sentiment Trend Direction</CardTitle>
                  <CardDescription>
                    How news sentiment is changing over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-4">
                    <div
                      className={`text-2xl font-medium ${
                        trends.trendDirection === "improving"
                          ? "text-green-600"
                          : trends.trendDirection === "worsening"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {trends.trendDirection === "improving"
                        ? "↗ Improving"
                        : trends.trendDirection === "worsening"
                        ? "↘ Worsening"
                        : "→ Stable"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Popular Keywords</CardTitle>
                <CardDescription>
                  Most frequently mentioned topics in recent news
                </CardDescription>
              </CardHeader>
              <CardContent>{renderKeywordCloud()}</CardContent>
            </Card>
          </div>
        );

      case "sentiment":
        return (
          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Sentiment Trends Over Time</CardTitle>
                <CardDescription>
                  How news sentiment has changed over the past{" "}
                  {trends?.periodDays || 30} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderTrendChart()}
                <div className="flex items-center justify-center mt-8 gap-6">
                  <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-green-500 mr-2"></span>
                    <span>Positive</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>
                    <span>Neutral</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>
                    <span>Negative</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topic sentiment distribution */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Topic Sentiment Distribution</CardTitle>
                <CardDescription>
                  How sentiment varies across different topics
                </CardDescription>
              </CardHeader>
              <CardContent>{renderTopicSentimentDistribution()}</CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Sentiment Analysis Explained</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Our sentiment analysis system classifies news articles based
                    on the emotional tone:
                  </p>
                  <div className="space-y-2">
                    <div
                      className={`p-3 rounded border ${getSentimentColor(
                        "positive"
                      )}`}
                    >
                      <strong>Positive:</strong> Articles with optimistic,
                      hopeful, or encouraging content
                    </div>
                    <div
                      className={`p-3 rounded border ${getSentimentColor(
                        "neutral"
                      )}`}
                    >
                      <strong>Neutral:</strong> Factual reporting without strong
                      emotional content
                    </div>
                    <div
                      className={`p-3 rounded border ${getSentimentColor(
                        "negative"
                      )}`}
                    >
                      <strong>Negative:</strong> Articles with concerning,
                      worrying, or discouraging content
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Note: Sentiment analysis is automated and not always
                    perfect. It analyzes the language used but may miss context.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Health News Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Understanding sentiment trends in health news can help:</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Track public health concerns over time</li>
                    <li>Identify emerging health threats</li>
                    <li>Understand pandemic response effectiveness</li>
                    <li>Monitor shifts in media coverage of health issues</li>
                    <li>Compare different outbreaks or health topics</li>
                  </ul>
                  <div className="mt-6 text-sm bg-yellow-50 border border-yellow-200 rounded p-3">
                    We recommend using this analysis alongside official health
                    data and expert opinions for a complete picture.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "keywords":
        return (
          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Top Keywords in Recent News</CardTitle>
                <CardDescription>
                  The most frequently mentioned terms across all articles
                </CardDescription>
              </CardHeader>
              <CardContent>{renderKeywordCloud()}</CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trends?.topKeywords?.slice(0, 6).map((keyword, index) => (
                <Card key={keyword.keyword} className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{keyword.keyword}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{keyword.count}</div>
                    <div className="text-sm text-gray-500">mentions</div>
                    {/* Show sentiment distribution for this keyword if available */}
                    {trends?.keywordSentiment?.[keyword.keyword] && (
                      <div className="mt-2">
                        <div className="flex h-2 mb-1 overflow-hidden rounded-full">
                          <div
                            style={{
                              width: `${
                                trends.keywordSentiment[keyword.keyword]
                                  .positivePercentage
                              }%`,
                            }}
                            className="bg-green-500"
                          ></div>
                          <div
                            style={{
                              width: `${
                                trends.keywordSentiment[keyword.keyword]
                                  .neutralPercentage
                              }%`,
                            }}
                            className="bg-blue-500"
                          ></div>
                          <div
                            style={{
                              width: `${
                                trends.keywordSentiment[keyword.keyword]
                                  .negativePercentage
                              }%`,
                            }}
                            className="bg-red-500"
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Sentiment:{" "}
                          {
                            trends.keywordSentiment[keyword.keyword]
                              .dominantSentiment
                          }
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Keyword analysis helps identify the most discussed topics in
                  health news. This can reveal:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Emerging public health concerns</li>
                  <li>Trending medical research topics</li>
                  <li>Shifts in pandemic-related terminology</li>
                  <li>Regional or seasonal health patterns</li>
                </ul>
                <div className="mt-6">
                  <p className="font-medium">Methodology:</p>
                  <p className="text-sm text-gray-600">
                    Our system extracts significant words from news headlines
                    and descriptions, filtering out common words to focus on
                    meaningful health-related terms. The size of each word in
                    the cloud represents its frequency across all articles.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link
              href="/news"
              className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to News
            </Link>
            <h1 className="text-3xl font-bold">News Trends</h1>
            <p className="text-gray-600">
              Analyze the sentiment and key topics in recent news
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-[180px]">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full p-2 pr-8 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="180">Last 6 months</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => fetchTrends(timePeriod)}
              className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>Error loading trends: {error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          renderSkeleton()
        ) : (
          <div className="w-full">
            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 mb-6">
              <TabButton
                className="bg-white text-slate-900"
                id="overview"
                label="Overview"
                icon={<TrendingUp className="w-4 h-4" />}
                isActive={activeTab === "overview"}
              />
              <TabButton
                className="bg-white text-slate-900"
                id="sentiment"
                label="Sentiment Analysis"
                icon={<MessageSquare className="w-4 h-4" />}
                isActive={activeTab === "sentiment"}
              />
              <TabButton
                className="bg-white text-slate-900"
                id="keywords"
                label="Key Topics"
                icon={<BarChart3 className="w-4 h-4" />}
                isActive={activeTab === "keywords"}
              />
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        )}
      </div>
    </main>
  );
}
