import React from "react";
import { Rss, Star, Tag, Mail, ArrowRight } from "lucide-react";

export const Blog = () => {
  const posts = [
    {
      title: "Understanding Pandemic Trends",
      excerpt:
        "Deep dive into recent global health data and emerging patterns.",
      date: "2024-06-15",
      category: "Analysis",
    },
    {
      title: "Technology in Pandemic Tracking",
      excerpt: "How AI and data science are revolutionizing health monitoring.",
      date: "2024-05-22",
      category: "Technology",
    },
  ];

  const featuredPosts = [
    {
      title: "Global Vaccination Progress Report",
      excerpt:
        "Comprehensive analysis of worldwide vaccination efforts and outcomes.",
      date: "2024-06-10",
      readTime: "8 min read",
      category: "Research",
    },
    {
      title: "Emerging Variants: What You Need to Know",
      excerpt:
        "Latest research on new variants and their potential impact on public health.",
      date: "2024-06-08",
      readTime: "6 min read",
      category: "Updates",
    },
  ];

  const categories = [
    { name: "Analysis", count: 15 },
    { name: "Research", count: 12 },
    { name: "Technology", count: 8 },
    { name: "Updates", count: 10 },
    { name: "Prevention", count: 7 },
    { name: "Healthcare", count: 9 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 flex justify-center items-center">
        <Rss className="mr-4 text-blue-600" size={40} />
        Pandemic Insights Blog
      </h1>

      {/* Featured Posts Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Star className="mr-3 text-yellow-500" size={24} />
          Featured Articles
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredPosts.map((post, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow border border-blue-100"
            >
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm mb-3">
                {post.category}
              </span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regular Posts */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Posts</h2>
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mb-3">
              {post.category}
            </span>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-3">{post.excerpt}</p>
            <span className="text-sm text-gray-500">{post.date}</span>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="mb-12 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Tag className="mr-3 text-blue-600" size={24} />
          Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <span className="text-gray-700">{category.name}</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
        <div className="flex items-center mb-4">
          <Mail className="mr-3" size={24} />
          <h2 className="text-2xl font-bold">Stay Updated</h2>
        </div>
        <p className="mb-6">
          Get the latest pandemic insights and research delivered to your inbox.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center">
            Subscribe
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
