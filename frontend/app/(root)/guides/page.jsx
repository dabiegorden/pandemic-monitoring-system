"use client";

import React, { useState } from "react";
import {
  Notebook,
  PlayCircle,
  Star,
  ChevronRight,
  BookOpen,
  Settings,
  Search,
} from "lucide-react";

export const GuidesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const standardGuides = [
    "Data Interpretation",
    "Dashboard Navigation",
    "Predictive Model Understanding",
    "Reporting Mechanisms",
  ];

  const quickStartGuides = [
    "System Overview",
    "First-time Setup",
    "Basic Navigation",
    "Essential Features",
  ];

  const advancedGuides = [
    "Custom Analytics",
    "API Integration",
    "Advanced Filtering",
    "Data Export Tools",
  ];

  const videoTutorials = [
    {
      title: "Getting Started",
      duration: "5:30",
      level: "Beginner",
    },
    {
      title: "Advanced Analytics",
      duration: "12:45",
      level: "Advanced",
    },
    {
      title: "Report Generation",
      duration: "8:15",
      level: "Intermediate",
    },
    {
      title: "Data Visualization",
      duration: "10:00",
      level: "Intermediate",
    },
  ];

  const filteredContent = (items) => {
    return items.filter((item) =>
      typeof item === "string"
        ? item.toLowerCase().includes(searchTerm.toLowerCase())
        : item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 flex justify-center items-center">
        <Notebook className="mr-4 text-blue-600" size={40} />
        User Guides
      </h1>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search guides..."
            className="w-full p-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Star className="text-yellow-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Quick Start</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredContent(quickStartGuides).map((guide, index) => (
            <div
              key={index}
              className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 hover:bg-yellow-100 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{guide}</h3>
                <ChevronRight className="text-yellow-500" size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Guides Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <BookOpen className="text-blue-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Standard Guides</h2>
        </div>
        <div className="space-y-4">
          {filteredContent(standardGuides).map((guide, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800">{guide}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Settings className="text-purple-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">
            Advanced Features
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredContent(advancedGuides).map((guide, index) => (
            <div
              key={index}
              className="bg-purple-50 border border-purple-100 rounded-lg p-6 hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{guide}</h3>
                <ChevronRight className="text-purple-500" size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Tutorials Section */}
      <div>
        <div className="flex items-center mb-4">
          <PlayCircle className="text-red-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Video Tutorials</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredContent(videoTutorials).map((tutorial, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {tutorial.title}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <span className="mr-4">{tutorial.duration}</span>
                    <span className="px-2 py-1 bg-red-100 rounded-full text-red-600">
                      {tutorial.level}
                    </span>
                  </div>
                </div>
                <PlayCircle className="text-red-500" size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;
