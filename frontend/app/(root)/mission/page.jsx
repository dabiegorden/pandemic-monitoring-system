import React from "react";
import { Target, Heart, Award, Globe } from "lucide-react";

const MissionPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl mt-12">
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800 flex items-center">
        <Target className="mr-4 text-blue-600" size={40} />
        Our Mission
      </h1>
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <div>
          <p>
            At the Pandemic Monitoring System, our mission is to provide
            real-time, comprehensive insights into pandemic trends, enabling
            proactive public health management and informed decision-making.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            Key Objectives
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate, up-to-date pandemic tracking</li>
            <li>Support public health officials with critical data</li>
            <li>Empower communities through transparent information</li>
            <li>Develop advanced predictive modeling techniques</li>
          </ul>
        </div>

        <p>
          We leverage cutting-edge technology to transform complex health data
          into actionable insights, bridging the gap between raw information and
          meaningful understanding.
        </p>

        {/* New Core Values Section */}
        <div className="bg-rose-50 p-4 rounded-lg border-l-4 border-rose-500 mt-8">
          <h2 className="text-2xl font-semibold mb-3 text-rose-700 flex items-center">
            <Heart className="mr-3 text-rose-600" size={28} />
            Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-semibold text-rose-600 mb-2">
                Accuracy & Integrity
              </h3>
              <p>
                Commitment to providing reliable, verified data with unwavering
                ethical standards.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-semibold text-rose-600 mb-2">Innovation</h3>
              <p>
                Continuously advancing our technological capabilities to improve
                pandemic monitoring.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-semibold text-rose-600 mb-2">
                Accessibility
              </h3>
              <p>
                Making critical health information available and understandable
                to all stakeholders.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h3 className="font-semibold text-rose-600 mb-2">
                Responsiveness
              </h3>
              <p>
                Rapidly adapting to emerging health challenges and community
                needs.
              </p>
            </div>
          </div>
        </div>

        {/* New Impact Goals Section */}
        <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
          <h2 className="text-2xl font-semibold mb-3 text-emerald-700 flex items-center">
            <Award className="mr-3 text-emerald-600" size={28} />
            Impact Goals
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                2024
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600">Near-Term</h3>
                <p>
                  Expand real-time monitoring capabilities to 100+ countries and
                  establish early warning systems.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                2025
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600">Mid-Term</h3>
                <p>
                  Implement AI-powered prediction models with 95% accuracy rate
                  for outbreak patterns.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                2026
              </div>
              <div>
                <h3 className="font-semibold text-emerald-600">Long-Term</h3>
                <p>
                  Create a unified global pandemic response network with
                  instantaneous data sharing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New Global Collaboration Section */}
        <div className="bg-violet-50 p-4 rounded-lg border-l-4 border-violet-500">
          <h2 className="text-2xl font-semibold mb-3 text-violet-700 flex items-center">
            <Globe className="mr-3 text-violet-600" size={28} />
            Global Collaboration
          </h2>
          <div className="prose prose-violet">
            <p className="mb-4">
              We actively partner with international health organizations,
              research institutions, and government agencies to create a unified
              front against global health challenges.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-bold text-violet-600 text-2xl mb-1">150+</p>
                <p className="text-sm">Partner Organizations</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-bold text-violet-600 text-2xl mb-1">50+</p>
                <p className="text-sm">Countries Covered</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="font-bold text-violet-600 text-2xl mb-1">24/7</p>
                <p className="text-sm">Monitoring Coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MissionPage;
