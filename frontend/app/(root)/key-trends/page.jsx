"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Brain,
  AlertTriangle,
  Shield,
  Activity,
  Globe,
  Users,
  Clock,
  Target,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function KeyTrendsPage() {
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timePeriod, setTimePeriod] = useState("30")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchTrends(timePeriod)
  }, [timePeriod])

  const fetchTrends = async (period) => {
    try {
      setLoading(true)
      const today = new Date()
      const startDate = new Date()
      startDate.setDate(today.getDate() - Number.parseInt(period))

      const formattedStartDate = startDate.toISOString().split("T")[0]
      const formattedEndDate = today.toISOString().split("T")[0]

      const response = await fetch(
        `http://localhost:5000/api/news/trends/sentiment?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      )

      if (!response.ok) throw new Error("Failed to fetch trends data")
      const data = await response.json()

      const transformedData = transformApiData(data, Number.parseInt(period))
      setTrends(transformedData)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const transformApiData = (apiData, periodDays) => {
    if (!apiData || !apiData.daily_trends || !apiData.overall_sentiment) {
      return null
    }

    const { daily_trends, overall_sentiment, top_keywords } = apiData

    const totalNewsCount = overall_sentiment.total_news || 0

    const sentimentPercentages = {
      positive: Number.parseFloat(overall_sentiment.positive_percentage) || 0,
      neutral: Number.parseFloat(overall_sentiment.neutral_percentage) || 0,
      negative: Number.parseFloat(overall_sentiment.negative_percentage) || 0,
      mixed: Number.parseFloat(overall_sentiment.mixed_percentage) || 0,
    }

    const sentimentTrends = daily_trends.map((day) => ({
      date: day.date,
      total: day.total_count,
      positive: day.positive_count,
      neutral: day.neutral_count,
      negative: day.negative_count,
      mixed: day.mixed_count || 0,
      positivePercentage: (day.positive_count / day.total_count) * 100 || 0,
      neutralPercentage: (day.neutral_count / day.total_count) * 100 || 0,
      negativePercentage: (day.negative_count / day.total_count) * 100 || 0,
      mixedPercentage: ((day.mixed_count || 0) / day.total_count) * 100 || 0,
    }))

    const overallSentiment = {
      positive: Math.round((sentimentPercentages.positive / 100) * totalNewsCount),
      neutral: Math.round((sentimentPercentages.neutral / 100) * totalNewsCount),
      negative: Math.round((sentimentPercentages.negative / 100) * totalNewsCount),
      mixed: Math.round((sentimentPercentages.mixed / 100) * totalNewsCount),
    }

    const topKeywords = top_keywords
      ? top_keywords.map((k) => ({
          keyword: k.keyword,
          count: k.count,
        }))
      : []

    // Calculate risk assessment
    const riskLevel = calculateRiskLevel(sentimentPercentages, topKeywords)
    const healthImpactScore = calculateHealthImpactScore(sentimentPercentages, totalNewsCount)

    return {
      totalNewsCount,
      periodDays,
      sentimentPercentages,
      sentimentTrends,
      overallSentiment,
      topKeywords,
      trendDirection: overall_sentiment.trend_direction || "stable",
      riskLevel,
      healthImpactScore,
      analysisMetadata: apiData.analysis_metadata || {},
    }
  }

  const calculateRiskLevel = (sentiments, keywords) => {
    const negativeWeight = sentiments.negative * 0.6
    const mixedWeight = sentiments.mixed * 0.3
    const riskKeywords = keywords.filter((k) =>
      ["outbreak", "death", "emergency", "crisis", "surge", "critical"].some((risk) =>
        k.keyword.toLowerCase().includes(risk),
      ),
    ).length

    const riskScore = negativeWeight + mixedWeight + riskKeywords * 5

    if (riskScore >= 50) return { level: "high", color: "red", label: "High Risk" }
    if (riskScore >= 25) return { level: "medium", color: "yellow", label: "Medium Risk" }
    return { level: "low", color: "green", label: "Low Risk" }
  }

  const calculateHealthImpactScore = (sentiments, totalNews) => {
    const impactScore = (sentiments.negative * 0.7 + sentiments.mixed * 0.3) * (totalNews / 100)
    return Math.min(Math.round(impactScore), 100)
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "negative":
        return "bg-red-100 text-red-800 border-red-300"
      case "mixed":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "neutral":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const renderAdvancedSentimentChart = () => {
    if (!trends) return null

    const { sentimentPercentages } = trends

    return (
      <div className="space-y-6">
        {/* Overall Distribution */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(sentimentPercentages).map(([sentiment, percentage]) => (
            <div key={sentiment} className="text-center">
              <div className={`p-4 rounded-lg border ${getSentimentColor(sentiment)}`}>
                <div className="text-2xl font-bold">{percentage.toFixed(1)}%</div>
                <div className="text-sm font-medium capitalize">{sentiment}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {Object.entries(sentimentPercentages).map(([sentiment, percentage]) => (
            <div key={sentiment} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{sentiment}</span>
                <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
              <Progress
                value={percentage}
                className={`h-3 ${
                  sentiment === "positive"
                    ? "[&>div]:bg-emerald-500"
                    : sentiment === "negative"
                      ? "[&>div]:bg-red-500"
                      : sentiment === "mixed"
                        ? "[&>div]:bg-purple-500"
                        : "[&>div]:bg-blue-500"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderAdvancedTrendChart = () => {
    if (!trends?.sentimentTrends || trends.sentimentTrends.length === 0)
      return <div className="text-center py-8 text-gray-500">No trend data available for this period</div>

    const sortedTrends = [...trends.sentimentTrends].sort((a, b) => new Date(a.date) - new Date(b.date))
    const maxValue = Math.max(...sortedTrends.map((t) => t.total))

    return (
      <div className="space-y-6">
        {/* Chart */}
        <div className="relative h-80 bg-gray-50 rounded-lg p-4">
          <div className="absolute inset-4 flex items-end">
            {sortedTrends.map((day, index) => {
              const totalHeight = (day.total / maxValue) * 100
              const positiveHeight = (day.positive / day.total) * totalHeight
              const neutralHeight = (day.neutral / day.total) * totalHeight
              const negativeHeight = (day.negative / day.total) * totalHeight
              const mixedHeight = ((day.mixed || 0) / day.total) * totalHeight

              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col-reverse items-center mx-1 group cursor-pointer relative"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48">
                    <p className="font-bold">{new Date(day.date).toLocaleDateString()}</p>
                    <p>Total: {day.total} articles</p>
                    <p className="text-emerald-300">Positive: {day.positive}</p>
                    <p className="text-blue-300">Neutral: {day.neutral}</p>
                    <p className="text-red-300">Negative: {day.negative}</p>
                    {day.mixed > 0 && <p className="text-purple-300">Mixed: {day.mixed}</p>}
                  </div>

                  {/* Date label */}
                  <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Stacked bars */}
                  <div className="flex flex-col w-full max-w-8" style={{ height: `${totalHeight}%` }}>
                    <div className="bg-emerald-500 w-full" style={{ height: `${positiveHeight}%` }} />
                    <div className="bg-blue-500 w-full" style={{ height: `${neutralHeight}%` }} />
                    <div className="bg-purple-500 w-full" style={{ height: `${mixedHeight}%` }} />
                    <div className="bg-red-500 w-full" style={{ height: `${negativeHeight}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-emerald-500 mr-2 rounded"></span>
            <span>Positive</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-blue-500 mr-2 rounded"></span>
            <span>Neutral</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-purple-500 mr-2 rounded"></span>
            <span>Mixed</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 bg-red-500 mr-2 rounded"></span>
            <span>Negative</span>
          </div>
        </div>
      </div>
    )
  }

  const renderKeywordCloud = () => {
    if (!trends?.topKeywords || trends.topKeywords.length === 0)
      return <div className="text-center py-8 text-gray-500">No keyword data available</div>

    const maxCount = Math.max(...trends.topKeywords.map((k) => k.count))

    return (
      <div className="space-y-6">
        {/* Keyword Cloud */}
        <div className="flex flex-wrap justify-center gap-3 py-6">
          {trends.topKeywords.slice(0, 30).map((keyword, index) => {
            const fontSize = 0.8 + (keyword.count / maxCount) * 1.2
            const isHealthCritical = ["covid", "death", "outbreak", "pandemic", "emergency"].some((term) =>
              keyword.keyword.toLowerCase().includes(term),
            )

            return (
              <Badge
                key={keyword.keyword}
                variant="outline"
                className={`px-3 py-2 ${
                  isHealthCritical
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                } hover:shadow-md transition-shadow`}
                style={{ fontSize: `${fontSize}rem` }}
              >
                {keyword.keyword} ({keyword.count})
              </Badge>
            )
          })}
        </div>

        {/* Top Keywords Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Mentioned Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trends.topKeywords.slice(0, 10).map((keyword, index) => (
                  <div key={keyword.keyword} className="flex justify-between items-center">
                    <span className="font-medium">{keyword.keyword}</span>
                    <Badge variant="secondary">{keyword.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Impact Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trends.topKeywords
                  .filter((k) =>
                    ["covid", "death", "outbreak", "pandemic", "vaccine", "treatment", "hospital"].some((term) =>
                      k.keyword.toLowerCase().includes(term),
                    ),
                  )
                  .slice(0, 8)
                  .map((keyword, index) => (
                    <div key={keyword.keyword} className="flex justify-between items-center">
                      <span className="font-medium">{keyword.keyword}</span>
                      <Badge variant="destructive">{keyword.count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderRiskAssessment = () => {
    if (!trends) return null

    const { riskLevel, healthImpactScore } = trends

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Current Risk Level:</span>
                <Badge
                  className={`${
                    riskLevel.color === "red"
                      ? "bg-red-100 text-red-800"
                      : riskLevel.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {riskLevel.label}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Health Impact Score:</span>
                  <span className="text-sm font-medium">{healthImpactScore}/100</span>
                </div>
                <Progress value={healthImpactScore} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Trend Direction:</span>
                <Badge
                  className={`${
                    trends.trendDirection === "improving"
                      ? "bg-green-100 text-green-800"
                      : trends.trendDirection === "worsening"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {trends.trendDirection === "improving"
                    ? "↗ Improving"
                    : trends.trendDirection === "worsening"
                      ? "↘ Worsening"
                      : "→ Stable"}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  Analysis based on {trends.totalNewsCount} articles over the past {trends.periodDays} days.
                </p>
                {trends.analysisMetadata.ai_powered && (
                  <p className="flex items-center gap-1 mt-2">
                    <Brain className="w-4 h-4" />
                    AI-powered sentiment analysis
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )

  const TabButton = ({ id, label, icon, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
        isActive ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      <span className="ml-2 font-medium">{label}</span>
    </button>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-blue-700">
                    <Globe className="w-5 h-5 mr-2" />
                    Total Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">{trends?.totalNewsCount || 0}</div>
                  <div className="text-sm text-blue-600">Past {trends?.periodDays || 30} days</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-emerald-700">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Positive News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900">{trends?.overallSentiment?.positive || 0}</div>
                  <div className="text-sm text-emerald-600">
                    {trends?.sentimentPercentages?.positive.toFixed(1) || 0}% of total
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-red-700">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Concerning News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">{trends?.overallSentiment?.negative || 0}</div>
                  <div className="text-sm text-red-600">
                    {trends?.sentimentPercentages?.negative.toFixed(1) || 0}% of total
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-purple-700">
                    <Users className="w-5 h-5 mr-2" />
                    Mixed Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">{trends?.overallSentiment?.mixed || 0}</div>
                  <div className="text-sm text-purple-600">
                    {trends?.sentimentPercentages?.mixed.toFixed(1) || 0}% of total
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Assessment */}
            {renderRiskAssessment()}

            {/* Sentiment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Sentiment Distribution
                </CardTitle>
                <CardDescription>Overall sentiment breakdown across all analyzed articles</CardDescription>
              </CardHeader>
              <CardContent>{renderAdvancedSentimentChart()}</CardContent>
            </Card>

            {/* Top Keywords Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Key Topics
                </CardTitle>
                <CardDescription>Most frequently discussed topics in recent health news</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trends?.topKeywords?.slice(0, 15).map((keyword) => (
                    <Badge key={keyword.keyword} variant="outline" className="text-sm">
                      {keyword.keyword} ({keyword.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "sentiment":
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Sentiment Trends Over Time
                </CardTitle>
                <CardDescription>
                  Daily sentiment analysis showing how public health news sentiment has evolved
                </CardDescription>
              </CardHeader>
              <CardContent>{renderAdvancedTrendChart()}</CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">Our advanced AI system analyzes health news using multiple factors:</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">AI-Powered Analysis</div>
                        <div className="text-sm text-gray-600">
                          Uses natural language processing to understand context and nuance
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Health-Specific Training</div>
                        <div className="text-sm text-gray-600">Trained on medical and public health terminology</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Real-Time Processing</div>
                        <div className="text-sm text-gray-600">Continuous analysis of incoming news articles</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clinical Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">This sentiment analysis supports:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Early detection of public health concerns
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Monitoring pandemic response effectiveness
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Tracking vaccine confidence trends
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Identifying misinformation patterns
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Supporting evidence-based policy decisions
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>Note:</strong> This analysis complements, but does not replace, professional medical
                      judgment and official health guidance.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "keywords":
        return (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Comprehensive Keyword Analysis
                </CardTitle>
                <CardDescription>
                  Advanced topic modeling and keyword extraction from health news content
                </CardDescription>
              </CardHeader>
              <CardContent>{renderKeywordCloud()}</CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Methodology</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">Our keyword extraction process:</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <div className="font-medium">Text Preprocessing</div>
                        <div className="text-sm text-gray-600">
                          Tokenization, stemming, and medical term normalization
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <div className="font-medium">Frequency Analysis</div>
                        <div className="text-sm text-gray-600">Statistical analysis of term occurrence patterns</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <div className="font-medium">Relevance Scoring</div>
                        <div className="text-sm text-gray-600">
                          Health-specific importance weighting and context analysis
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">Keyword trends support research in:</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Epidemiological Surveillance</div>
                      <div className="text-sm text-gray-600">Track disease outbreak patterns and geographic spread</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Public Health Communication</div>
                      <div className="text-sm text-gray-600">
                        Optimize messaging strategies and information campaigns
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Policy Impact Assessment</div>
                      <div className="text-sm text-gray-600">Evaluate effectiveness of health interventions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return <div>Tab content not found</div>
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Link href="/news" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to News
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Advanced Health News Analytics
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Professional-grade sentiment analysis and trend monitoring for public health intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-48 p-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="180">Last 6 months</option>
              </select>
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={() => fetchTrends(timePeriod)}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading trends: {error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          renderSkeleton()
        ) : (
          <div className="w-full">
            {/* Enhanced Tab Navigation */}
            <div className="flex flex-wrap gap-3 mb-8 p-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <TabButton
                id="overview"
                label="Executive Summary"
                icon={<TrendingUp className="w-5 h-5" />}
                isActive={activeTab === "overview"}
              />
              <TabButton
                id="sentiment"
                label="Sentiment Intelligence"
                icon={<Brain className="w-5 h-5" />}
                isActive={activeTab === "sentiment"}
              />
              <TabButton
                id="keywords"
                label="Topic Analysis"
                icon={<BarChart3 className="w-5 h-5" />}
                isActive={activeTab === "keywords"}
              />
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">{renderTabContent()}</div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
