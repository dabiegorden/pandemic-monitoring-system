"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

// Debounce function to delay search execution
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const NewsHeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newsResults, setNewsResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounced search function
  const fetchNewsResults = debounce(async (query) => {
    if (!query || query.trim() === "") {
      setError("Please enter a search term.");
      setNewsResults([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/news?query=${query}`
      );
      const data = await response.json();

      if (response.status === 404 || data.length === 0) {
        setError("No news found.");
        setNewsResults([]);
      } else {
        setNewsResults(data);
      }
    } catch (err) {
      setError("Error fetching news results.");
    } finally {
      setLoading(false);
    }
  }, 500);

  // Trigger search when the search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchNewsResults(searchTerm);
    } else {
      setNewsResults([]); // Clear results if the search term is empty
    }
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Manually trigger search on form submit
    if (searchTerm.trim()) {
      fetchNewsResults(searchTerm);
    }
  };

  // Helper function to format the date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-r pt-16 from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main hero content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Stay Informed on Global Health Updates
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Get real-time updates on disease outbreaks, prevention measures,
              and health advisories from trusted sources worldwide.
            </p>
            {/* <form
              onSubmit={handleSubmit}
              className="flex justify-between items-center gap-3"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for health news and updates..."
                  className="w-full py-3 px-4 pr-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-100" />
              </div>
              <div className="ring-2 ring-white/50 rounded-md text-xl px-4 py-2.5">
                <input
                  type="submit"
                  value="Search..."
                  className="cursor-pointer"
                />
              </div>
            </form> */}
          </div>
        </div>

        {/* Loading state */}
        {loading && <p className="text-white">Loading news...</p>}

        {/* Error state */}
        {error && <p className="text-red-500">{error}</p>}

        {/* News search results */}
        {newsResults.length > 0 && (
          <div className="grid gap-6 mt-8">
            {newsResults.map((newsItem, index) => (
              <div
                key={index}
                className="bg-white text-black rounded-lg p-6 shadow-lg"
              >
                <h4 className="text-2xl font-bold mb-2">{newsItem.title}</h4>
                <p className="text-lg mb-4">{newsItem.description}</p>
                <img
                  src={newsItem.image_url}
                  alt={newsItem.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-gray-500">
                  Date: {formatDate(newsItem.date)} | Time: {newsItem.time}
                </p>
                <a
                  href={newsItem.read_more}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading && !error && newsResults.length === 0 && searchTerm && (
          <p className="text-white">No news articles found.</p>
        )}
      </div>
    </div>
  );
};

export default NewsHeroSection;
