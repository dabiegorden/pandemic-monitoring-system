"use client";

import { motion } from "framer-motion";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const CovidChart = ({ data }) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  const chartData = {
    labels: data.map((stat) => stat.country),
    datasets: [
      {
        label: "Total Cases",
        data: data.map((stat) => stat.cases.total),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        fill: true,
        tension: 0.2,
      },
      {
        label: "Deaths",
        data: data.map((stat) => stat.deaths.total),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true,
        tension: 0.2,
      },
      {
        label: "Recovered",
        data: data.map((stat) => stat.cases.recovered),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: true,
        tension: 0.2,
      },
    ],
  };

  // Define options for the line chart
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      <div className="mt-8 bg-white px-4 py-4 rounded-md shadow-sm">
        <h2 className="text-lg font-bold text-center text-gray-700 mb-3">
          Statistics Over Countries
        </h2>
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default CovidChart;
