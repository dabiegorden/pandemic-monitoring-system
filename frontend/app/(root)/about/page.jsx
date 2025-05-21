"use client";

import React from "react";
import { motion } from "framer-motion";
import { GoProject } from "react-icons/go";
import { SiTransmission } from "react-icons/si";
import { FaGlobeAmericas, FaShieldAlt, FaChartLine } from "react-icons/fa";
import AccordionPage2 from "@/components/accordion";
import Accordion from "@/components/accordium";
import Benefit from "@/components/benefit";
import Divide1 from "@/components/divide1";
import Divide2 from "@/components/divide2";
import DividerPage from "@/components/divider";
import System from "@/components/how_system_work";
import Link from "next/link";

const AboutPage = () => {
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="about-page overflow-x-hidden">
      {/* Hero Section */}
      <motion.div
        className="hero-section relative text-center px-4 md:px-8 py-20 bg-gradient-to-br from-gray-900 to-gray-700"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
      >
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col justify-center items-center gap-6 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Real-Time Pandemic Monitoring System
          </h1>
          <h3 className="text-xl md:text-2xl text-orange-300 font-medium">
            Empowering Global Health Awareness
          </h3>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-6">
            A cutting-edge platform designed to track, predict, and respond to
            global health crises with unprecedented accuracy and speed.
          </p>
          <Link
            href="#learnmore"
            className="px-6 py-3 bg-orange-600 text-white rounded-full text-base md:text-lg font-semibold shadow-lg hover:bg-orange-700 transition-all transform hover:-translate-y-1 hover:scale-105 mb-4"
          >
            Explore Our Approach
          </Link>
        </div>
      </motion.div>

      {/* Existing Project Overview and Mission Section */}
      <motion.div
        className="px-4 md:px-8 pt-16 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
      >
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 text-center flex flex-col items-center gap-4 hover:shadow-xl transition-all">
          <GoProject className="text-5xl text-orange-600" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Project Overview
          </h2>
          <p className="text-gray-600 leading-relaxed">
            A comprehensive web-based platform providing real-time, global
            pandemic insights. We transform complex health data into actionable
            intelligence for individuals, health professionals, and
            organizations.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 text-center flex flex-col items-center gap-4 hover:shadow-xl transition-all">
          <SiTransmission className="text-5xl text-orange-600" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Mission and Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To revolutionize pandemic response through advanced data analytics,
            fostering global preparedness and enabling proactive health
            management across communities.
          </p>
        </div>
      </motion.div>

      {/* New Global Impact Section */}
      <motion.div
        className="px-4 md:px-8 py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-12">
            Our Global <span className="text-orange-600">Impact Pillars</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaGlobeAmericas className="text-4xl text-orange-600" />,
                title: "Global Reach",
                description:
                  "Covering pandemic data from regions worldwide, ensuring comprehensive global health monitoring.",
              },
              {
                icon: <FaShieldAlt className="text-4xl text-orange-600" />,
                title: "Predictive Protection",
                description:
                  "Advanced algorithms that forecast potential outbreak zones and risk levels before they escalate.",
              },
              {
                icon: <FaChartLine className="text-4xl text-orange-600" />,
                title: "Real-Time Analytics",
                description:
                  "Instantaneous data processing and visualization for rapid decision-making and strategic planning.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2"
              >
                <div className="flex flex-col items-center gap-4">
                  {item.icon}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Existing Key Features Section */}
      <div className="px-4 md:px-12 mt-8 bg-gray-50 py-16">
        <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-12">
          Key Features <span className="text-orange-600">of the System</span>
        </h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={animationVariants}
        >
          <div className="bg-white px-6 py-8 rounded-xl shadow-lg">
            <Accordion />
          </div>
          <div className="bg-white px-6 py-8 rounded-xl shadow-lg">
            <AccordionPage2 />
          </div>
        </motion.div>
      </div>

      {/* Remaining existing sections... (Divider, Pandemic Qualification, Benefit, System) remain the same */}
      <motion.div
        className="px-4 md:px-8 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
      >
        <DividerPage />
      </motion.div>

      <motion.div
        className="px-4 md:px-8 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={animationVariants}
      >
        <div className="text-center text-2xl font-bold text-slate-900 my-8">
          <h1>
            Under what circumstance do we classify{" "}
            <span className="text-orange-500">a disease as a pandemic?</span>
          </h1>
        </div>
        <div className="accordion">
          <div className="px-4 md:px-12 mt-8">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={animationVariants}
            >
              <div className="bg-white px-6 py-8 rounded-md shadow-lg">
                <Divide1 />
              </div>
              <div className="bg-white px-6 py-8 rounded-md shadow-lg">
                <Divide2 />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="px-4 md:px-8 my-8 py-8 bg-white rounded-md shadow-lg text-center text-gray-800">
        <Benefit />
      </div>

      <div className="px-4 md:px-8 py-12 bg-gray-50">
        <System />
      </div>
    </div>
  );
};

export default AboutPage;
