"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Loader2, ArrowUpRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import NewsHeroSection from "@/components/NewsHeroSection";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const categories = [
    { id: "all", name: "All News" },
    { id: "covid", name: "COVID-19" },
    { id: "ebola", name: "Ebola" },
    { id: "flu", name: "Influenza" },
  ];

  const filteredNews = news.filter((item) => {
    const lowerTitle = item.title.toLowerCase();
    const lowerDescription = (item.description || "").toLowerCase();
    const lowerCategory = activeCategory.toLowerCase();
    const lowerSearchQuery = searchQuery.toLowerCase();

    const matchesCategory =
      activeCategory === "all" ||
      lowerTitle.includes(lowerCategory) ||
      lowerDescription.includes(lowerCategory);

    const matchesSearchQuery =
      lowerTitle.includes(lowerSearchQuery) ||
      lowerDescription.includes(lowerSearchQuery);

    return matchesCategory && matchesSearchQuery;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading news updates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>Error loading news: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <main>
      <Navbar />
      <NewsHeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* news trends */}
        <div className="flex justify-between items-center">
          {/* Category buttons */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category?.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                activeCategory === category?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              >
                {category?.name}
              </button>
            ))}
          </div>
          {/* Key trends */}
          <div className="trends">
            <Link
              href={"/key-trends"}
              className="bg-blue-600 text-white font-bold text-xl py-2.5 px-4 rounded-md cursor-pointer hover:bg-gradient-to-tr hover:from-blue-500 hover:to-blue-700 hover:ease-in-out hover:transition hover:duration-300"
            >
              Key trends
            </Link>
          </div>
        </div>

        {/* Search input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 ring-2 ring-slate-500 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <Link
                href={`/news/${item?.id}`}
                key={item?.id}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <article className="h-full">
                  <div className="relative">
                    <img
                      src={item?.image_url || "/api/placeholder/400/240"}
                      alt={item?.title}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold line-clamp-2 flex-1">
                        {item?.title}
                      </h2>
                      <ArrowUpRight className="w-5 h-5 text-blue-500 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {item?.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{formatDate(item.date)}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{item?.time}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              No news articles found.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
