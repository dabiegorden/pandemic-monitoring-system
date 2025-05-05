"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lucide Icons
import {
  Globe,
  Clipboard,
  Activity,
  Loader2,
  AlertCircle,
  RecycleIcon,
  Calendar,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Notifications from "@/components/notications";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const Dashboard = () => {
  const [selectedCountry, setSelectedCountry] = useState("World");
  const [selectedCategory, setSelectedCategory] = useState("Cases");
  const [globalData, setGlobalData] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 1: Fix the countries list by removing duplicates
  // Using a Set to ensure uniqueness, then converting back to array
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
    "Argentina", // First occurrence of Argentina
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
    // Removed duplicate "Argentina" here
    "Armenia",
    "Aruba",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    // Removed duplicate "Bangladesh" here
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
  ];

  const categories = [
    { id: "Cases", icon: Clipboard, color: "blue" },
    { id: "Deaths", icon: Activity, color: "red" },
    { id: "Recovered", icon: RecycleIcon, color: "green" },
    {
      id: "Today",
      label: "Active Cases",
      icon: Calendar,
      color: "orange",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [globalResponse, countryResponse] = await Promise.all([
          fetch("https://disease.sh/v3/covid-19/all"),
          fetch("https://disease.sh/v3/covid-19/countries"),
        ]);

        if (!globalResponse.ok || !countryResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [globalData, countryData] = await Promise.all([
          globalResponse.json(),
          countryResponse.json(),
        ]);

        setGlobalData(globalData);
        setCountryData(countryData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentData =
    selectedCountry === "World"
      ? globalData
      : countryData.find((c) => c.country === selectedCountry);

  const formatNumber = (num) => num?.toLocaleString("en-US") ?? "0";

  const getMapData = () => {
    if (!countryData.length) return null;

    // Modify category key selection
    const categoryKey =
      selectedCategory === "Today"
        ? "todayCases"
        : selectedCategory.toLowerCase();

    const dataPoints = countryData.map((item) => item[categoryKey]);
    const maxValue = Math.max(...dataPoints);
    const minMarkerSize = 5;
    const maxMarkerSize = 40;

    // Base map data (all countries)
    const baseMapData = {
      type: "scattergeo",
      locationmode: "country names",
      lat: countryData.map((item) => item.countryInfo.lat),
      lon: countryData.map((item) => item.countryInfo.long),
      text: countryData.map(
        (item) =>
          `${item.country}<br>${
            selectedCategory === "Today" ? "Active Cases" : selectedCategory
          }: ${formatNumber(item[categoryKey])}`
      ),
      hoverinfo: "text",
      marker: {
        size: countryData.map((item) => {
          const scaledSize =
            (Math.sqrt(item[categoryKey] || 1) / Math.sqrt(maxValue || 1)) *
            maxMarkerSize;
          return Math.max(scaledSize, minMarkerSize);
        }),
        color: countryData.map((item) => item[categoryKey]),
        colorscale: "YlOrRd",
        cmin: 0,
        cmax: maxValue,
        colorbar: {
          title:
            selectedCategory === "Today" ? "Active Cases" : selectedCategory,
          thickness: 20,
        },
      },
    };

    // If World is selected, just return the base map
    if (selectedCountry === "World") {
      return [baseMapData];
    }

    // Find the selected country data
    const selectedCountryData = countryData.find(
      (c) => c.country === selectedCountry
    );

    if (!selectedCountryData) {
      return [baseMapData];
    }

    // Add a second layer for the highlighted country
    const highlightedCountry = {
      type: "scattergeo",
      locationmode: "country names",
      lat: [selectedCountryData.countryInfo.lat],
      lon: [selectedCountryData.countryInfo.long],
      text: [
        `${selectedCountryData.country}<br>${
          selectedCategory === "Today" ? "Active Cases" : selectedCategory
        }: ${formatNumber(selectedCountryData[categoryKey])}`,
      ],
      hoverinfo: "text",
      marker: {
        size: 15,
        color: "rgba(0, 0, 255, 0.8)",
        symbol: "circle",
        line: {
          color: "blue",
          width: 2,
        },
      },
      name: selectedCountryData.country,
      showlegend: true,
    };

    return [baseMapData, highlightedCountry];
  };

  const renderSummaryData = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((skeleton) => (
            <Skeleton key={skeleton} className="h-4 w-full" />
          ))}
        </div>
      );
    }

    const categoryIcons = {
      Cases: { icon: Clipboard, color: "blue" },
      Deaths: { icon: Activity, color: "red" },
      Recovered: { icon: RecycleIcon, color: "green" },
      Today: { icon: Calendar, color: "orange" },
    };

    const { icon: SelectedIcon, color: selectedColor } =
      categoryIcons[selectedCategory];

    // Modify category key to use todayCases for Today
    const categoryKey =
      selectedCategory === "Today"
        ? "todayCases"
        : selectedCategory.toLowerCase();

    return (
      <div className="grid grid-cols-1 gap-4">
        <SummaryCard
          title={`Total ${
            selectedCategory === "Today" ? "Active Cases" : selectedCategory
          }`}
          value={formatNumber(currentData?.[categoryKey])}
          color={selectedColor}
          icon={SelectedIcon}
        />
        <div className="text-sm text-gray-500 text-center">
          Showing{" "}
          {selectedCategory === "Today" ? "Active Cases" : selectedCategory} for{" "}
          {selectedCountry}
        </div>
      </div>
    );
  };

  const SummaryCard = ({ title, value, color, icon: Icon }) => (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`text-${color}-500 w-8 h-8`} />
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading dashboard data: {error}. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Country Selector */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Globe className="text-blue-600" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full md:w-auto text-lg font-semibold bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {/* Step 2: Use a more robust approach for rendering options */}
                {countries.map((country, index) => (
                  <option key={`${country}-${index}`} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${
                      selectedCategory === id
                        ? `bg-${color}-100 text-${color}-600 border-${color}-200`
                        : "bg-white hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label || id}</span>
                </button>
              ))}
            </div>

            <div className="notifications">
              <Notifications />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-md shadow-md">
        {/* Map Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedCategory === "Today" ? "Active Cases" : selectedCategory}{" "}
              Data - {selectedCountry}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="w-full h-[400px]">
                <Plot
                  data={getMapData()}
                  layout={{
                    geo: {
                      projection: { type: "natural earth" },
                      showcoastlines: true,
                      coastlinecolor: "rgb(200, 200, 200)",
                      showland: true,
                      landcolor: "rgb(240, 240, 240)",
                      showcountries: true,
                      countrycolor: "rgb(200, 200, 200)",
                    },
                    margin: { t: 0, b: 0, l: 0, r: 0 },
                    paper_bgcolor: "transparent",
                    plot_bgcolor: "transparent",
                    showlegend: selectedCountry !== "World",
                    legend: {
                      x: 0.02,
                      y: 0.98,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                      bordercolor: "rgba(0, 0, 0, 0.2)",
                      borderwidth: 1,
                    },
                  }}
                  config={{
                    responsive: true,
                    displayModeBar: false,
                    scrollZoom: false,
                  }}
                  className="w-full h-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>{renderSummaryData()}</CardContent>
          <div className="pt-4 px-8">
            <Link
              href="/"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-gradient-to-tr hover:from-blue-500 hover:to-orange-500 hover:transition hover:duration-300 hover:ease-in-out"
            >
              Return Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
