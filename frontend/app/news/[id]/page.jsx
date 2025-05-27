"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  ArrowUpRight,
  Facebook,
  Twitter,
  Linkedin,
  Brain,
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function NewsDetailsPage() {
  const params = useParams()
  const id = params?.id

  const router = useRouter()
  const [newsDetails, setNewsDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    if (!id) {
      setError("Invalid news ID")
      setLoading(false)
      return
    }

    const fetchNewsDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/news/${id}`)
        if (!response.ok) throw new Error("Failed to fetch news details")
        const data = await response.json()
        setNewsDetails(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetails()
  }, [id])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsDetails.title,
          text: newsDetails.description,
          url: window.location.href,
        })
      } catch (err) {
        setShowShareMenu(!showShareMenu)
      }
    } else {
      setShowShareMenu(!showShareMenu)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Add actual bookmark functionality here
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getSentimentConfig = (sentiment, sentimentAnalysis) => {
    if (sentimentAnalysis) {
      const severity = sentimentAnalysis.severity_level
      const concern = sentimentAnalysis.public_concern_level

      switch (sentiment) {
        case "positive":
          return {
            color: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: "✅",
            label: "Positive",
            description: "Encouraging health news",
          }
        case "negative":
          if (severity === "critical" || concern >= 8) {
            return {
              color: "bg-red-50 text-red-700 border-red-200",
              icon: "🚨",
              label: "Critical",
              description: "Requires immediate attention",
            }
          } else if (severity === "high" || concern >= 6) {
            return {
              color: "bg-orange-50 text-orange-700 border-orange-200",
              icon: "⚠️",
              label: "Concerning",
              description: "Monitor closely",
            }
          } else {
            return {
              color: "bg-yellow-50 text-yellow-700 border-yellow-200",
              icon: "⚡",
              label: "Negative",
              description: "Concerning developments",
            }
          }
        case "mixed":
          return {
            color: "bg-purple-50 text-purple-700 border-purple-200",
            icon: "🔄",
            label: "Mixed",
            description: "Complex situation",
          }
        default:
          return {
            color: "bg-blue-50 text-blue-700 border-blue-200",
            icon: "ℹ️",
            label: "Informative",
            description: "Factual reporting",
          }
      }
    }

    // Fallback to basic sentiment
    switch (sentiment) {
      case "positive":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: "😊",
          label: "Positive",
          description: "Good news",
        }
      case "negative":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: "😟",
          label: "Negative",
          description: "Concerning news",
        }
      default:
        return null
    }
  }

  const renderSentimentAnalysis = () => {
    if (!newsDetails.sentiment_analysis) return null

    const analysis = newsDetails.sentiment_analysis
    const sentimentConfig = getSentimentConfig(analysis.sentiment, analysis)

    return (
      <Card className="mb-6 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            AI Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Sentiment */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Primary Sentiment:</span>
            <Badge className={`${sentimentConfig?.color} font-medium`}>
              <span className="mr-1">{sentimentConfig?.icon}</span>
              {sentimentConfig?.label}
            </Badge>
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Analysis Confidence:</span>
              <span className="text-sm text-gray-600">{Math.round(analysis.confidence * 100)}%</span>
            </div>
            <Progress value={analysis.confidence * 100} className="h-2" />
          </div>

          {/* Public Concern Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Public Concern Level:</span>
              <span className="text-sm text-gray-600">{analysis.public_concern_level}/10</span>
            </div>
            <Progress
              value={analysis.public_concern_level * 10}
              className={`h-2 ${
                analysis.public_concern_level >= 7
                  ? "[&>div]:bg-red-500"
                  : analysis.public_concern_level >= 5
                    ? "[&>div]:bg-yellow-500"
                    : "[&>div]:bg-green-500"
              }`}
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-gray-500">Emotional Tone</div>
              <div className="font-medium capitalize">{analysis.emotional_tone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Health Impact</div>
              <div
                className={`font-medium capitalize ${
                  analysis.health_impact === "beneficial"
                    ? "text-green-600"
                    : analysis.health_impact === "harmful"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {analysis.health_impact}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Severity Level</div>
              <div className="font-medium capitalize">{analysis.severity_level}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Actionability</div>
              <div className="font-medium capitalize">{analysis.actionability}</div>
            </div>
          </div>

          {/* Key Emotions */}
          {analysis.key_emotions && analysis.key_emotions.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-2">Key Emotions Detected:</div>
              <div className="flex flex-wrap gap-2">
                {analysis.key_emotions.map((emotion, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Risk Indicators */}
          {analysis.risk_indicators && analysis.risk_indicators.length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-2">Risk Indicators:</div>
              <div className="flex flex-wrap gap-2">
                {analysis.risk_indicators.map((indicator, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Reasoning */}
          {analysis.reasoning && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-500 mb-1">AI Analysis Reasoning:</div>
              <div className="text-sm text-gray-700">{analysis.reasoning}</div>
            </div>
          )}

          {/* Analysis Timestamp */}
          <div className="text-xs text-gray-400 pt-2 border-t">
            Analysis performed: {new Date(analysis.analysis_timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-ping mx-auto"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Loading article details...</p>
            <p className="text-sm text-gray-500">Analyzing content and sentiment</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading news: {error}</AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    )
  }

  if (!newsDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-8xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-900">Article Not Found</h2>
          <p className="text-gray-600 text-center max-w-md">
            The news article you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => router.push("/news")} className="mt-4">
            Return to News List
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const sentimentConfig = getSentimentConfig(
    newsDetails.sentiment_analysis?.sentiment || newsDetails.sentiment_classification,
    newsDetails.sentiment_analysis,
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/50 backdrop-blur-sm md:mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>

          <div className="space-y-4">
            {/* Sentiment Badge */}
            {sentimentConfig && (
              <div className="flex justify-center mb-4">
                <Badge className={`${sentimentConfig.color} px-4 py-2 text-sm font-medium`}>
                  <span className="mr-2">{sentimentConfig.icon}</span>
                  {sentimentConfig.label} - {sentimentConfig.description}
                </Badge>
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">{newsDetails.title}</h1>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(newsDetails.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{newsDetails.time}</span>
                </div>
                {newsDetails.sentiment_analysis && (
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-1" />
                    <span>AI Analyzed</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={handleShare} className="whitespace-nowrap">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 p-2 bg-white rounded-lg shadow-lg border z-10">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(`https://facebook.com/share/url=${window.location.href}`)}
                        >
                          <Facebook className="w-4 h-4 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`)}
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => window.open(`https://linkedin.com/shareArticle?url=${window.location.href}`)}
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={`whitespace-nowrap ${isBookmarked ? "bg-blue-50" : ""}`}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-blue-500" : ""}`} />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={newsDetails.image_url || "/placeholder.svg?height=675&width=1200"}
            alt={newsDetails.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* AI Sentiment Analysis */}
        {renderSentimentAnalysis()}

        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              {newsDetails.description}
            </p>

            {newsDetails.read_more && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">Continue Reading</h2>
                <p className="mb-4 text-blue-800">
                  Read the complete article on the original source for comprehensive coverage and additional details:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={newsDetails.read_more}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group bg-white px-4 py-2 rounded-lg shadow-sm border border-blue-200 hover:border-blue-300 transition-all"
                  >
                    Visit Original Article
                    <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>

                  <Link
                    href="/news"
                    className="inline-flex items-center justify-center py-2 px-4 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    More Health News
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Activity className="w-5 h-5" />
                Explore Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-600 mb-4">
                Discover how this story fits into broader health news patterns and sentiment trends.
              </p>
              <Link
                href="/key-trends"
                className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-medium"
              >
                View Analytics Dashboard
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Shield className="w-5 h-5" />
                Stay Informed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 mb-4">
                Get notified about important health updates and breaking pandemic news.
              </p>
              <Link
                href={user ? "/profile" : "/sign-in"}
                className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
              >
                {user ? "Manage Notifications" : "Sign Up for Alerts"}
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </article>

      <Footer />
    </main>
  )
}
