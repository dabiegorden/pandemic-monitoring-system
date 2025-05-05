"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Chart from "@/components/chart";

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
    e.preventDefault();
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
    <main>
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
        {/* Form to input user data and query */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-4xl text-center mb-3">
              Interract with the model to make your
              <br />
              predictions.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="userInput" className="block text-xl">
                  Enter data or query for prediction:
                </label>
                <input
                  type="text"
                  id="userInput"
                  value={userInput}
                  onChange={handleChange}
                  placeholder="e.g., Predict pandemic outbreaks in 2025"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Predicting...
                  </span>
                ) : (
                  "Get Prediction"
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Error alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Display predictions */}
        {predictions.length > 0 && (
          <Card className="">
            <CardHeader>
              <CardTitle className="text-xl">Prediction Results:</CardTitle>
            </CardHeader>
            <CardContent>
              {typeof predictions[0] === "string" ? (
                <div className="p-4 bg-white rounded-lg text-[1.2rem]">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {predictions[0]}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left border-b">Year</th>
                        <th className="px-4 py-2 text-left border-b">
                          Outbreak
                        </th>
                        <th className="px-4 py-2 text-left border-b">Impact</th>
                        <th className="px-4 py-2 text-left border-b">Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((prediction, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-2">{prediction.year}</td>
                          <td className="px-4 py-2">{prediction.outbreak}</td>
                          <td className="px-4 py-2">{prediction.impact}</td>
                          <td className="px-4 py-2">{prediction.region}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {/* <Chart /> */}
    </main>
  );
};

export default PandemicPredictionPage;
