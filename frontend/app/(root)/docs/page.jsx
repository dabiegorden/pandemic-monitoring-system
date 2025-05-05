import React from "react";
import {
  Clipboard,
  Shield,
  Terminal,
  HelpCircle,
  Server,
  Lock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Laptop,
} from "lucide-react";

const DocumentationPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
    <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 flex justify-center items-center">
      <Clipboard className="mr-4 text-blue-600" size={40} />
      System Documentation
    </h1>
    <div className="bg-white shadow-lg rounded-lg p-8">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Getting Started
        </h2>
        <p className="text-gray-700 mb-4">
          Comprehensive guide to understanding and utilizing our Pandemic
          Monitoring System.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Key Sections
        </h2>
        <ul className="space-y-2 text-gray-600">
          <li>• Installation Guide</li>
          <li>• Data Collection Methodology</li>
          <li>• API Integration</li>
          <li>• Dashboard Usage</li>
        </ul>
      </section>

      {/* New System Requirements Section */}
      <section className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center">
          <Server className="mr-3" size={24} />
          System Requirements
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center">
              <Laptop className="mr-2" size={20} />
              Hardware Requirements
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={16} />
                Processor: Intel i5/AMD Ryzen 5 or higher
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={16} />
                RAM: 8GB minimum, 16GB recommended
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={16} />
                Storage: 256GB SSD or higher
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center">
              <Terminal className="mr-2" size={20} />
              Software Requirements
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={16} />
                OS: Windows 10/11, macOS 12+, or Linux
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" size={16} />
                Browser: Chrome 90+, Firefox 88+, Safari 14+
              </li>
              <li className="flex items-center">
                <XCircle className="mr-2 text-red-500" size={16} />
                Not compatible with Internet Explorer
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* New Data Security & Privacy Section */}
      <section className="mb-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center">
          <Shield className="mr-3" size={24} />
          Data Security & Privacy
        </h2>
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Lock className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold mb-2">Data Encryption</h3>
              <p className="text-sm text-gray-600">
                End-to-end encryption for all sensitive data using AES-256
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Shield className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold mb-2">Compliance</h3>
              <p className="text-sm text-gray-600">
                HIPAA, GDPR, and ISO 27001 certified
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Lock className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold mb-2">Access Control</h3>
              <p className="text-sm text-gray-600">
                Role-based access control with MFA support
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-800">
              Note: All users must complete security training before accessing
              sensitive data.
            </p>
          </div>
        </div>
      </section>

      {/* New Troubleshooting & Support Section */}
      <section className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center">
          <HelpCircle className="mr-3" size={24} />
          Troubleshooting & Support
        </h2>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Common Issues</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <XCircle
                    className="mr-2 text-red-500 mt-1 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-sm text-gray-600">
                    Connection timeout during data sync
                  </p>
                </div>
                <div className="flex items-start">
                  <XCircle
                    className="mr-2 text-red-500 mt-1 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-sm text-gray-600">
                    Dashboard loading performance issues
                  </p>
                </div>
                <div className="flex items-start">
                  <XCircle
                    className="mr-2 text-red-500 mt-1 flex-shrink-0"
                    size={16}
                  />
                  <p className="text-sm text-gray-600">
                    API authentication errors
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Support Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 text-blue-500" size={16} />
                  <p className="text-sm text-gray-600">
                    24/7 Live Chat Support
                  </p>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="mr-2 text-blue-500" size={16} />
                  <p className="text-sm text-gray-600">
                    Email: support@pandemic-monitor.com
                  </p>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="mr-2 text-blue-500" size={16} />
                  <p className="text-sm text-gray-600">
                    Technical Support: +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <p className="text-sm text-green-800">
              Pro Tip: Check our FAQ section and knowledge base before
              contacting support for faster resolution.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default DocumentationPage;
