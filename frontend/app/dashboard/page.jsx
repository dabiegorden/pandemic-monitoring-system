"use client"

import { useState, useEffect } from "react"

// Lucide Icons
import {
  Globe,
  Clipboard,
  Activity,
  Loader2,
  AlertCircle,
  RecycleIcon,
  Calendar,
  TrendingUp,
  MapPin,
  ArrowUp,
  ArrowDown,
  BarChart3,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Notifications from "@/components/notications"

const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState("World")
  const [selectedCategory, setSelectedCategory] = useState("Cases")
  const [globalData, setGlobalData] = useState(null)
  const [countryData, setCountryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const countries = [
    "World",
    "USA",
    "India",
    "China",
    "Brazil",
    "South Africa",
    "Russia",
    "Germany",
    "Ghana",
    "France",
    "UK",
    "Canada",
    "Australia",
    "Italy",
    "Spain",
    "Japan",
    "South Korea",
    "Mexico",
    "Saudi Arabia",
    "Turkey",
    "Egypt",
    "Nigeria",
    "Indonesia",
    "Pakistan",
    "Bangladesh",
    "Argentina",
    "Ukraine",
    "Poland",
    "Netherlands",
    "Sweden",
    "Iran",
    "Iraq",
    "Israel",
    "Vietnam",
    "Thailand",
    "Malaysia",
    "Philippines",
    "Colombia",
    "Venezuela",
    "Peru",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Armenia",
    "Aruba",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia",
    "Botswana",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
  ]

  const categories = [
    { id: "Cases", icon: Clipboard, color: "blue", gradient: "from-blue-500 to-blue-600" },
    { id: "Deaths", icon: Activity, color: "red", gradient: "from-red-500 to-red-600" },
    { id: "Recovered", icon: RecycleIcon, color: "green", gradient: "from-green-500 to-green-600" },
    {
      id: "Today",
      label: "Active Cases",
      icon: Calendar,
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [globalResponse, countryResponse] = await Promise.all([
          fetch("https://disease.sh/v3/covid-19/all"),
          fetch("https://disease.sh/v3/covid-19/countries"),
        ])

        if (!globalResponse.ok || !countryResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const [globalData, countryData] = await Promise.all([globalResponse.json(), countryResponse.json()])

        setGlobalData(globalData)
        setCountryData(countryData)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentData = selectedCountry === "World" ? globalData : countryData.find((c) => c.country === selectedCountry)

  const formatNumber = (num) => num?.toLocaleString("en-US") ?? "0"

  const getTopCountries = () => {
    if (!countryData.length) return []

    const categoryKey = selectedCategory === "Today" ? "todayCases" : selectedCategory.toLowerCase()

    return countryData
      .filter((country) => country[categoryKey] > 0)
      .sort((a, b) => (b[categoryKey] || 0) - (a[categoryKey] || 0))
      .slice(0, 10)
  }

  const getChangeIndicator = (country, index) => {
    if (index === 0) return null
    const prevCountry = getTopCountries()[index - 1]
    const currentValue = country[selectedCategory === "Today" ? "todayCases" : selectedCategory.toLowerCase()] || 0
    const prevValue = prevCountry[selectedCategory === "Today" ? "todayCases" : selectedCategory.toLowerCase()] || 0
    
    if (currentValue > prevValue) return <ArrowUp className="w-3 h-3 text-green-500" />
    if (currentValue < prevValue) return <ArrowDown className="w-3 h-3 text-red-500" />
    return null
  }

  const renderDataVisualization = () => {
    if (loading) {
      return (
        <div className="h-[500px] flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-500 animate-pulse">Loading global data...</p>
        </div>
      )
    }

    const topCountries = getTopCountries()
    const categoryKey = selectedCategory === "Today" ? "todayCases" : selectedCategory.toLowerCase()
    const maxValue = topCountries[0]?.[categoryKey] || 1

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Top 10 Countries
            </h3>
            <p className="text-sm text-gray-500">
              {selectedCategory === "Today" ? "Active Cases" : selectedCategory} Rankings
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topCountries.map((country, index) => {
            const value = country[categoryKey] || 0
            const percentage = (value / maxValue) * 100
            const isSelected = country.country === selectedCountry
            const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

            return (
              <div
                key={country.country}
                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                  isSelected 
                    ? `border-${selectedCategoryData.color}-400 bg-gradient-to-r from-${selectedCategoryData.color}-50 to-${selectedCategoryData.color}-100 shadow-lg shadow-${selectedCategoryData.color}-200/50` 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md"
                }`}
                onClick={() => setSelectedCountry(country.country)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index < 3 
                        ? index === 0 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' 
                          : index === 1 
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                            : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                          {country.country}
                        </span>
                        {isSelected && (
                          <div className="flex items-center gap-1">
                            <MapPin className={`w-4 h-4 text-${selectedCategoryData.color}-600`} />
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              Selected
                            </Badge>
                          </div>
                        )}
                      </div>
                      {country.population && (
                        <span className="text-xs text-gray-500">
                          Pop: {formatNumber(country.population)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {getChangeIndicator(country, index)}
                      <span className="font-bold text-2xl text-gray-800">
                        {formatNumber(value)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {((value / (globalData?.[categoryKey] || 1)) * 100).toFixed(1)}% of global
                    </div>
                  </div>
                </div>

                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${selectedCategoryData.gradient} relative overflow-hidden`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selectedCountry !== "World" && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-blue-800 text-lg">
                  {selectedCountry}
                </span>
                <p className="text-sm text-blue-600">Currently Selected</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">
                  {selectedCategory === "Today" ? "Active Cases" : selectedCategory}
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatNumber(currentData?.[categoryKey])}
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">Global Rank</p>
                <p className="text-2xl font-bold text-blue-800">
                  #{getTopCountries().findIndex(c => c.country === selectedCountry) + 1}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSummaryData = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((skeleton) => (
            <div key={skeleton} className="animate-pulse">
              <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
            </div>
          ))}
        </div>
      )
    }

    const categoryIcons = {
      Cases: { icon: Clipboard, color: "blue", gradient: "from-blue-500 to-blue-600" },
      Deaths: { icon: Activity, color: "red", gradient: "from-red-500 to-red-600" },
      Recovered: { icon: RecycleIcon, color: "green", gradient: "from-green-500 to-green-600" },
      Today: { icon: Calendar, color: "orange", gradient: "from-orange-500 to-orange-600" },
    }

    const { icon: SelectedIcon, color: selectedColor, gradient } = categoryIcons[selectedCategory]
    const categoryKey = selectedCategory === "Today" ? "todayCases" : selectedCategory.toLowerCase()

    return (
      <div className="space-y-6">
        <SummaryCard
          title={`Total ${selectedCategory === "Today" ? "Active Cases" : selectedCategory}`}
          value={formatNumber(currentData?.[categoryKey])}
          color={selectedColor}
          gradient={gradient}
          icon={SelectedIcon}
          isPrimary={true}
        />

        {selectedCountry !== "World" && currentData && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Complete Statistics
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <SummaryCard 
                title="Total Cases" 
                value={formatNumber(currentData.cases)} 
                color="blue" 
                gradient="from-blue-500 to-blue-600"
                icon={Clipboard} 
              />
              <SummaryCard 
                title="Total Deaths" 
                value={formatNumber(currentData.deaths)} 
                color="red" 
                gradient="from-red-500 to-red-600"
                icon={Activity} 
              />
              <SummaryCard
                title="Total Recovered"
                value={formatNumber(currentData.recovered)}
                color="green"
                gradient="from-green-500 to-green-600"
                icon={RecycleIcon}
              />
            </div>
          </div>
        )}

        <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
          <p className="text-sm text-gray-600 font-medium">
            Displaying {selectedCategory === "Today" ? "Active Cases" : selectedCategory}
          </p>
          <p className="text-lg font-bold text-gray-800">{selectedCountry}</p>
        </div>
      </div>
    )
  }

  const SummaryCard = ({ title, value, color, gradient, icon: Icon, isPrimary = false }) => (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isPrimary ? 'ring-2 ring-blue-200 shadow-lg' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-0">
        <div className={`p-6 bg-gradient-to-r ${gradient} text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
              <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 shadow-xl">
          <CardContent className="p-6">
            <Alert variant="destructive" className="border-0 bg-transparent p-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Connection Error</h3>
                  <p className="text-sm text-red-600">Unable to load dashboard data</p>
                </div>
              </div>
              <AlertDescription className="text-red-700 mb-4">
                {error}. Please check your connection and try again.
              </AlertDescription>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Header Section */}
      <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm relative z-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Country Selector */}
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Globe className="text-white w-6 h-6" />
              </div>
              <div className="flex-1 lg:flex-none">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Region
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full lg:w-64 text-lg font-semibold bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                >
                  {countries.map((country, index) => (
                    <option key={`${country}-${index}`} value={country}>
                      {country === "World" ? "🌍 Global" : `🏴󠁧󠁢󠁥󠁮󠁧󠁿 ${country}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Buttons */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center lg:text-left">
                Data Category
              </label>
              <div className="flex flex-wrap justify-center lg:justify-end gap-3">
                {categories.map(({ id, label, icon: Icon, color, gradient }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className={`
                      flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 border-2 font-medium
                      ${
                        selectedCategory === id
                          ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg transform scale-105`
                          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label || id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications with Highest Z-Index */}
            <div className="notifications relative z-50">
              <Notifications />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Data Visualization Section */}
        <Card className="xl:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-gray-800">
                  {selectedCategory === "Today" ? "Active Cases" : selectedCategory} Rankings
                </div>
                <p className="text-sm text-gray-500 font-normal">
                  Global statistics and country comparisons
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">{renderDataVisualization()}</CardContent>
        </Card>

        {/* Summary Section */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-gray-800">Summary</div>
                <p className="text-sm text-gray-500 font-normal">Key statistics</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">{renderSummaryData()}</CardContent>
          <div className="px-6 pb-6">
            <Link
              href="/"
              className="group relative w-full inline-flex items-center justify-center py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="relative z-10">Return Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard