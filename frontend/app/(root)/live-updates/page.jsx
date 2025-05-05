"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MdLiveTv } from "react-icons/md";

const API_URL = "http://localhost:5000/api/live-updates"; // Backend API
const SOCKET_SERVER_URL = "http://localhost:5000"; // WebSocket server

export default function LiveUpdates() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
        setHistory((prev) => [...prev.slice(-9), formatData(json)]); // Keep last 10 updates
      } catch (error) {
        console.error("🚨 Error fetching initial data:", error);
      }
    };

    fetchData();

    // Establish WebSocket connection
    const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });

    socket.on("connect", () => console.log("✅ WebSocket connected!"));

    socket.on("liveUpdate", (update) => {
      console.log("📡 Live update received:", update);
      setData(update);
      setHistory((prev) => [...prev.slice(-9), formatData(update)]); // Keep chart history
    });

    socket.on("connect_error", (err) =>
      console.error("❌ WebSocket Connection Error:", err)
    );

    return () => {
      socket.disconnect();
      console.log("❌ WebSocket disconnected");
    };
  }, []);

  return (
    <div className="min-h-screen mt-5 bg-gray-900 text-white">
      {/* Hero Section */}
      <header
        className="relative bg-cover bg-center h-80 flex flex-col items-center justify-center text-center p-5"
        // style={{ backgroundImage: 'url("/pandemic-bg.jpg")' }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold bg-black bg-opacity-50 p-3 rounded-lg">
          🌍 Live Pandemic Updates
        </h1>
        <p className="mt-3  text-lg md:text-xl bg-black bg-opacity-50 p-2 rounded-lg">
          Real-time global pandemic tracking.
        </p>

        <p className="mt-3 flex items-center gap-2 text-lg md:text-xl bg-black bg-opacity-50 p-2 rounded-lg">
          <MdLiveTv className="text-red-500 text-2xl" /> Live updates for both
          Covid-19, Ebola & Influenza.
        </p>
      </header>

      {/* Live Data Display */}
      <div className="container mx-auto mt-8 p-5">
        {data ? (
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard
              title="Total Cases"
              value={data.cases}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Deaths"
              value={data.deaths}
              color="bg-red-500"
            />

            <StatCard
              title="Total Recovered"
              value={data.recovered}
              color="bg-green-500"
            />

            {/* Three more cards */}
            {/* <StatCard
              title="Critical Cases"
              value={data.critical}
              color="bg-indigo-500"
            /> */}
            <StatCard
              title="Tests Conducted"
              value={data.tests}
              color="bg-violet-500"
            />
            <StatCard
              title="Today Cases"
              value={data.todayCases}
              color="bg-red-800"
            />
            <StatCard
              title="Today Deaths"
              value={data.todayDeaths}
              color="bg-orange-500"
            />
          </div>
        ) : (
          <p className="text-center text-xl">Loading data...</p>
        )}

        {/* Chart Section */}
        {history.length > 1 && (
          <div className="mt-10 bg-gray-800 p-5 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-5">
              📊 Cases Trend (Last 10 Updates)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cases"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="deaths"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="recovered"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <h1 className="text-3xl text-center py-24 md:text-4xl font-bold bg-black bg-opacity-50 p-3 rounded-lg">
        🌍 Live updates for Ebola
      </h1>
    </div>
  );
}

// Helper Function to Format Data for Chart
function formatData(update) {
  return {
    timestamp: new Date(update.updated).toLocaleTimeString(), // Format timestamp
    cases: update.cases,
    deaths: update.deaths,
    recovered: update.recovered,
  };
}

// Reusable Stat Card Component
function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-lg ${color} text-white text-center`}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-3xl font-extrabold mt-2">{value.toLocaleString()}</p>
    </div>
  );
}
