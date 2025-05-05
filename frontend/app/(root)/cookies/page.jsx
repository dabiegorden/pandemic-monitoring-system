import React from "react";
import { Cookie, Shield, Globe, Lock } from "lucide-react";

// Cookie Policy Page
const CookiePolicyPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800 flex items-center">
        <Cookie className="mr-4 text-blue-600" size={40} />
        Cookie Policy
      </h1>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Transparent Cookie Usage
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use cookies to enhance your user experience and system
          functionality.
        </p>
      </section>

      <div className="space-y-6 text-gray-700">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Types of Cookies We Use
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Essential system cookies</li>
            <li>Performance and analytics cookies</li>
            <li>User preference tracking</li>
            <li>Secure session management</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Cookie Management
          </h3>
          <p className="mb-4">You can manage cookie preferences through:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Browser settings</li>
            <li>Our cookie consent panel</li>
            <li>Detailed cookie settings</li>
          </ul>
        </div>

        {/* New Section: Data Privacy and Protection */}
        <section className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800 flex items-center">
            <Shield className="mr-3 text-blue-600" size={24} />
            Data Privacy and Protection
          </h3>
          <p className="mb-4">
            We are committed to protecting your personal data and ensuring
            transparency in our data collection practices.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Minimal data collection principles</li>
            <li>Anonymization of tracking data</li>
            <li>Compliance with international privacy regulations</li>
            <li>Regular privacy and security audits</li>
          </ul>
        </section>

        {/* New Section: International Cookie Compliance */}
        <section className="p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800 flex items-center">
            <Globe className="mr-3 text-blue-600" size={24} />
            International Cookie Compliance
          </h3>
          <p className="mb-4">
            Our cookie policy adheres to global privacy standards and
            regulations across different jurisdictions.
          </p>
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="font-semibold mb-2 text-blue-700">
              Regulatory Compliance
            </h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>GDPR (European Union)</li>
              <li>CCPA (California)</li>
              <li>PIPEDA (Canada)</li>
              <li>LGPD (Brazil)</li>
            </ul>
          </div>
        </section>

        {/* New Section: Cookie Security Measures */}
        <section className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800 flex items-center">
            <Lock className="mr-3 text-blue-600" size={24} />
            Cookie Security Measures
          </h3>
          <p className="mb-4">
            We implement robust security protocols to protect your data and
            maintain the integrity of our cookie practices.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Encryption of sensitive cookie data</li>
            <li>Regular security updates</li>
            <li>Strict access controls</li>
            <li>Continuous monitoring for potential vulnerabilities</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

export default CookiePolicyPage;
