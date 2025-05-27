"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Activity, TrendingUp, AlertTriangle, Globe } from "lucide-react";

const PandemicPredictionPage = () => {
  const [userInput, setUserInput] = useState(""); // User input for prediction
  const [predictions, setPredictions] = useState([]); // Store predictions
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(null); // Error state if API call fails

  // Handle input change for the text field
  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  // Handle form submission to fetch prediction
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Reset error

    try {
      // Make POST request to backend API
      const response = await fetch("http://localhost:5000/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }), // Send user input
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON response
      let prediction = data.prediction; // Extract prediction from the API response

      // Ensure prediction is a string and clean up unwanted characters
      if (typeof prediction === "string") {
        prediction = prediction
          .replace(/\\n/g, "\n") // Convert newline characters to actual new lines
          .replace(/\*\*/g, "") // Remove markdown-style bold (**)
          .replace(/\\"/g, '"'); // Replace escaped quotes with regular quotes

        setPredictions([prediction]); // Store the cleaned prediction as an array
      } else if (Array.isArray(prediction)) {
        // If prediction is an array (table-like data), handle it
        setPredictions(prediction);
      } else {
        setPredictions(["No prediction available."]);
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setError("An error occurred while fetching predictions.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div>
        <div className="container mx-auto px-4 py-6 mt-16">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Pandemic Prediction Platform
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-slate-800 mb-4 leading-tight">
            AI-Powered Pandemic
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Forecasting & Analysis
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Leverage advanced machine learning models to predict pandemic trends, analyze outbreak patterns, and make data-driven decisions for public health.
          </p>
        </div>

        {/* Input Form Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center font-semibold flex items-center justify-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>Make Your Prediction</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="userInput" className="block text-lg font-medium text-slate-700">
                  Enter your query or data for prediction:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="userInput"
                    value={userInput}
                    onChange={handleChange}
                    placeholder="e.g., Predict pandemic outbreaks in 2025, analyze COVID-19 trends..."
                    className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                    required
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-3 h-5 w-5" />
                    Analyzing & Predicting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center cursor-pointer">
                    <Activity className="mr-3 h-5 w-5" />
                    Generate Prediction
                  </span>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {predictions.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Prediction Results</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>AI Analysis & Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {typeof predictions[0] === "string" ? (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-lg">
                        {predictions[0]}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
                            <th className="px-6 py-4 text-left font-semibold text-slate-700 text-sm uppercase tracking-wider">Year</th>
                            <th className="px-6 py-4 text-left font-semibold text-slate-700 text-sm uppercase tracking-wider">Outbreak</th>
                            <th className="px-6 py-4 text-left font-semibold text-slate-700 text-sm uppercase tracking-wider">Impact</th>
                            <th className="px-6 py-4 text-left font-semibold text-slate-700 text-sm uppercase tracking-wider">Region</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {predictions.map((prediction, index) => (
                            <tr
                              key={index}
                              className="hover:bg-slate-50 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 text-slate-800 font-medium">{prediction.year}</td>
                              <td className="px-6 py-4 text-slate-800">{prediction.outbreak}</td>
                              <td className="px-6 py-4 text-slate-800">{prediction.impact}</td>
                              <td className="px-6 py-4 text-slate-800">{prediction.region}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-500">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Powered by advanced AI models for accurate pandemic forecasting</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PandemicPredictionPage;