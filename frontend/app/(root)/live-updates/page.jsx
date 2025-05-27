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
  const [isConnected, setIsConnected] = useState(false);

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

    socket.on("connect", () => {
      console.log("✅ WebSocket connected!");
      setIsConnected(true);
    });

    socket.on("liveUpdate", (update) => {
      console.log("📡 Live update received:", update);
      setData(update);
      setHistory((prev) => [...prev.slice(-9), formatData(update)]); // Keep chart history
    });

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket Connection Error:", err);
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      console.log("❌ WebSocket disconnected");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 mt-12">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <header className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <MdLiveTv className={`text-5xl transition-colors duration-1000 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-ping`}></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Global Pandemic Tracker
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/80 mb-4 font-light">
            Real-time global pandemic monitoring system
          </p>
          
          <div className="flex items-center justify-center gap-3 text-sm md:text-base">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isConnected ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
              {isConnected ? '🟢 LIVE' : '🔴 OFFLINE'}
            </div>
            <span className="text-white/60">•</span>
            <span className="text-white/80">COVID-19 • Ebola • Influenza</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pb-16">
        {data ? (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <StatCard
                title="Total Cases"
                value={data.cases}
                icon="🦠"
                gradient="from-blue-500 to-blue-700"
                delay="0"
              />
              <StatCard
                title="Total Deaths"
                value={data.deaths}
                icon="💀"
                gradient="from-red-500 to-red-700"
                delay="100"
              />
              <StatCard
                title="Total Recovered"
                value={data.recovered}
                icon="🩹"
                gradient="from-green-500 to-green-700"
                delay="200"
              />
              <StatCard
                title="Tests Conducted"
                value={data.tests}
                icon="🧪"
                gradient="from-purple-500 to-purple-700"
                delay="300"
              />
              <StatCard
                title="Today's Cases"
                value={data.todayCases}
                icon="📈"
                gradient="from-orange-500 to-red-600"
                delay="400"
              />
              <StatCard
                title="Today's Deaths"
                value={data.todayDeaths}
                icon="⚠️"
                gradient="from-red-600 to-red-800"
                delay="500"
              />
            </div>

            {/* Chart Section */}
            {history.length > 1 && (
              <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl animate-fade-in-up animation-delay-600">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    📊 Trend Analysis
                  </h2>
                  <p className="text-white/60">Last 10 real-time updates</p>
                </div>
                
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                        formatter={(value) => [value.toLocaleString(), '']}
                      />
                      <Line
                        type="monotone"
                        dataKey="cases"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                        name="Cases"
                      />
                      <Line
                        type="monotone"
                        dataKey="deaths"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                        name="Deaths"
                      />
                      <Line
                        type="monotone"
                        dataKey="recovered"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
                        name="Recovered"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-xl text-white/80">Loading pandemic data...</p>
          </div>
        )}

        {/* Ebola Section */}
        <div className="mt-20 text-center">
          <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              🌍 Ebola Monitoring
            </h2>
            <p className="text-white/60 mt-4 text-lg">
              Specialized tracking for Ebola outbreaks worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
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

// Enhanced Stat Card Component
function StatCard({ title, value, icon, gradient, delay }) {
  return (
    <div className={`group animate-fade-in-up animation-delay-${delay}`}>
      <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl border border-white/10 hover:scale-105 transform transition-all duration-300 cursor-pointer overflow-hidden`}>
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">{icon}</span>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
          </div>
          
          <h3 className="text-white/90 text-sm font-medium mb-2 uppercase tracking-wide">
            {title}
          </h3>
          
          <p className="text-white text-2xl md:text-3xl font-black tracking-tight">
            {value?.toLocaleString() || '0'}
          </p>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
}