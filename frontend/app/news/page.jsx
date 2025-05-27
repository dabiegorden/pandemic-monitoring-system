"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Loader2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
  TrendingUp,
  AlertTriangle,
  Brain,
  Shield,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import NewsHeroSection from "@/components/NewsHeroSection"

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  const categories = [
    { id: "all", name: "All News", icon: "📰" },
    { id: "covid", name: "COVID-19", icon: "🦠" },
    { id: "ebola", name: "Ebola", icon: "🩸" },
    { id: "influenza", name: "Influenza", icon: "🤧" },
    { id: "vaccine", name: "Vaccines", icon: "💉" },
    { id: "research", name: "Research", icon: "🔬" },
    { id: "treatment", name: "Treatment", icon: "🏥" },
  ]

  const fetchNews = async (page = 1, query = "") => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      })

      if (query.trim()) {
        params.append("query", query.trim())
      }

      const response = await fetch(`http://localhost:5000/api/news?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const data = await response.json()
      setNews(data.data || [])
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 6,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      )
    } catch (error) {
      setError(error.message)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(1, searchQuery)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchNews(1, searchQuery)
  }

  const handlePageChange = (page) => {
    fetchNews(page, searchQuery)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId)
    setSearchQuery(categoryId === "all" ? "" : categoryId)
    fetchNews(1, categoryId === "all" ? "" : categoryId)
  }

  const getSentimentConfig = (sentiment, sentimentAnalysis) => {
    // Use advanced sentiment analysis if available
    if (sentimentAnalysis) {
      const severity = sentimentAnalysis.severity_level
      const concern = sentimentAnalysis.public_concern_level

      switch (sentiment) {
        case "positive":
          return {
            color: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: "✅",
            label: "Positive",
            bgGradient: "from-emerald-50 to-green-50",
          }
        case "negative":
          if (severity === "critical" || concern >= 8) {
            return {
              color: "bg-red-50 text-red-700 border-red-200",
              icon: "🚨",
              label: "Critical",
              bgGradient: "from-red-50 to-pink-50",
            }
          } else if (severity === "high" || concern >= 6) {
            return {
              color: "bg-orange-50 text-orange-700 border-orange-200",
              icon: "⚠️",
              label: "Concerning",
              bgGradient: "from-orange-50 to-yellow-50",
            }
          } else {
            return {
              color: "bg-yellow-50 text-yellow-700 border-yellow-200",
              icon: "⚡",
              label: "Negative",
              bgGradient: "from-yellow-50 to-amber-50",
            }
          }
        case "mixed":
          return {
            color: "bg-purple-50 text-purple-700 border-purple-200",
            icon: "🔄",
            label: "Mixed",
            bgGradient: "from-purple-50 to-indigo-50",
          }
        default:
          return {
            color: "bg-blue-50 text-blue-700 border-blue-200",
            icon: "ℹ️",
            label: "Informative",
            bgGradient: "from-blue-50 to-cyan-50",
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
          bgGradient: "from-green-50 to-emerald-50",
        }
      case "negative":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: "😟",
          label: "Negative",
          bgGradient: "from-red-50 to-pink-50",
        }
      default:
        return null
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const { currentPage, totalPages } = pagination

    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!pagination.hasPreviousPage}
        className="flex items-center gap-1 hover:bg-blue-50"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>,
    )

    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={1 === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className={1 === currentPage ? "bg-blue-600 text-white" : "hover:bg-blue-50"}
        >
          1
        </Button>,
      )
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-500">
            ...
          </span>,
        )
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(page)}
          className={page === currentPage ? "bg-blue-600 text-white" : "hover:bg-blue-50"}
        >
          {page}
        </Button>,
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-gray-500">
            ...
          </span>,
        )
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className={totalPages === currentPage ? "bg-blue-600 text-white" : "hover:bg-blue-50"}
        >
          {totalPages}
        </Button>,
      )
    }

    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="flex items-center gap-1 hover:bg-blue-50"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>,
    )

    return buttons
  }

  if (loading && news.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <NewsHeroSection />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-ping mx-auto"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Loading latest health news...</p>
            <p className="text-sm text-gray-500">Analyzing sentiment and trends</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <NewsHeroSection />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">Error loading news: {error}</AlertDescription>
          </Alert>
        )}

        {/* Enhanced Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Category buttons */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105
                    ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Key trends button */}
            <Link
              href="/key-trends"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-lg py-3 px-6 rounded-xl cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              Key Trends
            </Link>
          </div>

          {/* Enhanced Search */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search health news, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </form>
        </div>

        {/* Results info */}
        {pagination.totalItems > 0 && (
          <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>{" "}
              of <span className="font-semibold text-gray-900">{pagination.totalItems}</span> results
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Brain className="w-4 h-4" />
              AI-powered sentiment analysis
            </div>
          </div>
        )}

        {/* Loading overlay for pagination */}
        {loading && news.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-lg font-medium text-gray-700">Loading...</span>
            </div>
          </div>
        )}

        {/* Enhanced News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {news.length > 0
            ? news.map((item) => {
                const sentimentConfig = getSentimentConfig(
                  item.sentiment_analysis?.sentiment || item.sentiment_classification,
                  item.sentiment_analysis,
                )

                return (
                  <Card
                    key={item.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    <div className="relative">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.image_url || "/placeholder.svg?height=240&width=400"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Enhanced Sentiment Badge */}
                      {sentimentConfig && (
                        <div className="absolute top-4 right-4">
                          <Badge
                            className={`${sentimentConfig.color} backdrop-blur-sm bg-opacity-90 font-medium px-3 py-1 text-xs border shadow-lg`}
                          >
                            <span className="mr-1">{sentimentConfig.icon}</span>
                            {sentimentConfig.label}
                          </Badge>
                        </div>
                      )}

                      {/* Confidence indicator for AI analysis */}
                      {item.sentiment_analysis?.confidence && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-black/20 text-white backdrop-blur-sm border-white/20 text-xs">
                            <Brain className="w-3 h-3 mr-1" />
                            {Math.round(item.sentiment_analysis.confidence * 100)}% confident
                          </Badge>
                        </div>
                      )}

                      {/* Urgency indicator */}
                      {item.sentiment_analysis?.actionability === "immediate" && (
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-red-500 text-white animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-bold line-clamp-2 flex-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h2>
                        <ArrowUpRight className="w-5 h-5 text-blue-500 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ml-2 flex-shrink-0" />
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{item.description}</p>

                      {/* Enhanced metadata */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Analysis Summary */}
                      {item.sentiment_analysis && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">AI Analysis</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Concern Level:</span>
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${
                                      item.sentiment_analysis.public_concern_level >= 7
                                        ? "bg-red-500"
                                        : item.sentiment_analysis.public_concern_level >= 5
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                    style={{ width: `${item.sentiment_analysis.public_concern_level * 10}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-700 font-medium">
                                  {item.sentiment_analysis.public_concern_level}/10
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Health Impact:</span>
                              <span
                                className={`ml-1 font-medium ${
                                  item.sentiment_analysis.health_impact === "beneficial"
                                    ? "text-green-600"
                                    : item.sentiment_analysis.health_impact === "harmful"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {item.sentiment_analysis.health_impact}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/news/${item.id}`}
                        className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                      >
                        Read Full Article
                      </Link>
                    </CardContent>
                  </Card>
                )
              })
            : !loading && (
                <div className="col-span-full text-center py-16">
                  <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                    <div className="text-8xl mb-6">📰</div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">No news articles found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery
                        ? `No articles match your search for "${searchQuery}"`
                        : "No news articles are currently available"}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        onClick={() => {
                          setSearchQuery("")
                          fetchNews(1, "")
                        }}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </div>
              )}
        </div>

        {/* Enhanced Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2 flex-wrap justify-center">{renderPaginationButtons()}</div>
              <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                Page <span className="font-semibold text-gray-700">{pagination.currentPage}</span> of{" "}
                <span className="font-semibold text-gray-700">{pagination.totalPages}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
