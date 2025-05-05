"use client";

import { useState } from "react";
import { Carousel } from "antd";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import image3 from "@/public/assets/image-3.jpg";
import image4 from "@/public/assets/image-4.jpg";
import image5 from "@/public/assets/image-5.jpg";
import {
  ArrowRight,
  Bell,
  Shield,
  Users,
  TrendingUp,
  Mail,
  ChevronRight,
  Map,
  Book,
  Stethoscope,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react";
import { MdLiveTv } from "react-icons/md";

export default function Hero() {
  const [formData, setFormData] = useState({ email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ email: "" });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const stats = [
    {
      icon: <Shield className="w-6 h-6" />,
      value: "24/7",
      label: "Monitoring",
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: "50K+",
      label: "Insights",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "200+",
      label: "Daily Updates",
    },
  ];

  const features = [
    {
      title: "Real-time Updates",
      description:
        "Get instant notifications about emerging health situations worldwide.",
      icon: <Bell className="w-6 h-6" />,
    },
    {
      title: "Expert Analysis",
      description: "Access detailed reports and analysis from health experts.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Global Coverage",
      description: "Comprehensive coverage of health situations globally.",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  const interactiveResources = [
    {
      title: "Interactive Risk Map",
      description:
        "Visualize global pandemic risk levels and hotspots in real-time.",
      icon: <Map className="w-6 h-6" />,
      link: "/risk-map",
    },
    {
      title: "Pandemic Knowledge Base",
      description:
        "Comprehensive guides and in-depth information about health threats.",
      icon: <Book className="w-6 h-6" />,
      link: "/knowledge-base",
    },
    {
      title: "Medical Expert Consultations",
      description: "Connect with health professionals for personalized advice.",
      icon: <Stethoscope className="w-6 h-6" />,
      link: "/expert-consultations",
    },
  ];

  const emergencyResources = [
    {
      title: "Immediate Alerts",
      description: "Instant notifications for critical health emergencies.",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    },
    {
      title: "Symptom Checker",
      description: "Quick self-assessment tool for potential health risks.",
      icon: <Activity className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Official Guidelines",
      description: "Comprehensive documentation from health authorities.",
      icon: <FileText className="w-6 h-6 text-blue-500" />,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative h-screen"
      >
        <Carousel autoplay autoplaySpeed={5000} className="h-full">
          {[image3, image4, image5].map((image, index) => (
            <div key={index} className="relative h-screen">
              <Image
                src={image || "/placeholder.svg"}
                fill
                style={{ objectFit: "cover" }}
                alt={`Slide ${index + 1}`}
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center text-white space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold">
                    Get the Latest{" "}
                    <span className="text-orange-500">Pandemic Updates</span>
                  </h1>
                  <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                    Stay informed with real-time updates on global health
                    situations.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg text-center">
                <div className="text-orange-500 mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border hover:shadow-lg transition-shadow bg-white"
              >
                <div className="text-orange-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive Resources Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 bg-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Our Interactive Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {interactiveResources.map((resource, index) => (
              <Link
                href={resource.link}
                key={index}
                className="p-6 rounded-lg border hover:shadow-lg transition-all group bg-white"
              >
                <div className="text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <span className="text-orange-500 inline-flex items-center gap-2">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Emergency Resources Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Critical Health Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {emergencyResources.map((resource, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border hover:shadow-lg transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* User Community Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 bg-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Join Our Global Health Community
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with thousands of users, share insights, and stay
                informed about global health trends. Our community-driven
                platform empowers you with collective knowledge and real-time
                information.
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-orange-500" />
                  <span>Collaborate and Share Experiences</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-500" />
                  <span>Secure and Private Communication</span>
                </li>
                <li className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <span>Stay Updated with Global Trends</span>
                </li>
              </ul>
              <Link
                href="/community"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 transition-all"
              >
                Join Community <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Community Highlights
                </h3>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <p className="font-medium">Global Health Insights</p>
                    <p className="text-sm text-gray-600">
                      Latest discussions and expert perspectives
                    </p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Resource Sharing</p>
                    <p className="text-sm text-gray-600">
                      Practical advice and support from community members
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Support</p>
                    <p className="text-sm text-gray-600">
                      Real-time communication during health crises
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 bg-orange-50"
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Stay Updated with Latest Insights
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community to receive real-time updates and important news
              directly to your inbox
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 px-4 py-2 rounded-lg ring-2 ring-orange-600 border focus:ring-2 focus:ring-orange-700 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                Subscribe <ChevronRight className="w-4 h-4" />
              </button>
            </form>
            {submitted && (
              <p className="text-green-500 mt-4">Successfully subscribed!</p>
            )}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
