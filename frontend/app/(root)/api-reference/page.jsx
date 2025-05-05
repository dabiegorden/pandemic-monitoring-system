import React from "react";
import { Code, Key, Terminal, FileJson } from "lucide-react";

const APIReferencePage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
    <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 flex justify-center items-center">
      <Code className="mr-4 text-blue-600" size={40} />
      API Reference
    </h1>
    <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
      {/* Existing Endpoint Overview Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Endpoint Overview
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Global Statistics</h3>
            <code className="bg-gray-100 p-1 rounded">
              GET /api/global-stats
            </code>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Regional Trends</h3>
            <code className="bg-gray-100 p-1 rounded">
              GET /api/regional-trends
            </code>
          </div>
        </div>
      </section>

      {/* New Authentication Section */}
      <section className="border-t pt-8">
        <div className="flex items-center mb-4">
          <Key className="mr-3 text-blue-600" size={24} />
          <h2 className="text-2xl font-semibold text-blue-700">
            Authentication
          </h2>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <h3 className="font-semibold mb-2">API Key Authentication</h3>
            <p className="text-gray-600 mb-2">
              Include your API key in the request header:
            </p>
            <code className="bg-gray-100 p-2 rounded block text-sm">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              Keep your API key secure and never expose it in client-side code.
            </p>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Rate Limiting</h4>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Free tier: 1000 requests/day</li>
              <li>Pro tier: 10000 requests/day</li>
              <li>Enterprise tier: Custom limits</li>
            </ul>
          </div>
        </div>
      </section>

      {/* New Request Examples Section */}
      <section className="border-t pt-8">
        <div className="flex items-center mb-4">
          <Terminal className="mr-3 text-blue-600" size={24} />
          <h2 className="text-2xl font-semibold text-blue-700">
            Request Examples
          </h2>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">cURL</h3>
            <pre className="text-sm overflow-x-auto">
              {`curl -X GET "https://api.pandemic-monitor.com/v1/global-stats" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              JavaScript
            </h3>
            <pre className="text-sm overflow-x-auto">
              {`const response = await fetch('https://api.pandemic-monitor.com/v1/global-stats', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}
            </pre>
          </div>
        </div>
      </section>

      {/* New Response Schemas Section */}
      <section className="border-t pt-8">
        <div className="flex items-center mb-4">
          <FileJson className="mr-3 text-blue-600" size={24} />
          <h2 className="text-2xl font-semibold text-blue-700">
            Response Schemas
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Global Statistics Response</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {`{
  "data": {
    "totalCases": number,
    "activeCases": number,
    "recovered": number,
    "lastUpdated": string (ISO 8601),
    "regions": {
      [regionName: string]: {
        "cases": number,
        "trend": "increasing" | "decreasing" | "stable"
      }
    }
  },
  "meta": {
    "requestId": string,
    "timestamp": string (ISO 8601)
  }
}`}
              </pre>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800 mb-2">
              Success Response Codes
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded mr-2">
                  200
                </span>
                <span>Successful request</span>
              </li>
              <li className="flex items-center">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded mr-2">
                  304
                </span>
                <span>Not modified (cached response)</span>
              </li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h4 className="font-semibold text-red-800 mb-2">
              Error Response Codes
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-red-200 text-red-800 px-2 py-1 rounded mr-2">
                  401
                </span>
                <span>Unauthorized (invalid API key)</span>
              </li>
              <li className="flex items-center">
                <span className="bg-red-200 text-red-800 px-2 py-1 rounded mr-2">
                  429
                </span>
                <span>Rate limit exceeded</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default APIReferencePage;
