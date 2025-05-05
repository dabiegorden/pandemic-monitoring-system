import React from "react";
import {
  CheckCircle,
  Shield,
  Lock,
  FileText,
  Globe,
  Inbox,
} from "lucide-react";

// Compliance Page
const CompliancePage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800 flex items-center">
        <CheckCircle className="mr-4 text-blue-600" size={40} />
        Regulatory Compliance
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Our Commitment to Global Standards
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We adhere to the highest standards of regulatory compliance in health
          data management.
        </p>
      </section>

      <div className="space-y-6 text-gray-700">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Regulatory Frameworks
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>GDPR (European Union)</li>
            <li>HIPAA (United States)</li>
            <li>CCPA (California)</li>
            <li>Global Health Data Protection Standards</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Compliance Mechanisms
          </h3>
          <p className="mb-4">We ensure compliance through:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Regular independent audits</li>
            <li>Robust data protection protocols</li>
            <li>Transparent reporting</li>
            <li>Continuous regulatory monitoring</li>
          </ul>
        </div>

        {/* New Section: Data Privacy and Security */}
        <section className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <Shield className="mr-3 text-blue-600" size={30} />
            <h3 className="text-xl font-semibold text-blue-800">
              Data Privacy and Security
            </h3>
          </div>
          <p className="mb-4 text-gray-700">
            We implement comprehensive security measures to protect sensitive
            health information:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>End-to-end encryption for all data transmissions</li>
            <li>Multi-factor authentication</li>
            <li>Advanced intrusion detection systems</li>
            <li>Regular security vulnerability assessments</li>
          </ul>
        </section>

        {/* New Section: Ethical Data Handling */}
        <section className="p-4">
          <div className="flex items-center mb-4">
            <Lock className="mr-3 text-blue-600" size={30} />
            <h3 className="text-xl font-semibold text-blue-800">
              Ethical Data Handling
            </h3>
          </div>
          <p className="mb-4 text-gray-700">
            Our approach to data management goes beyond legal requirements:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Strict data minimization principles</li>
            <li>Transparent consent mechanisms</li>
            <li>User-controlled data sharing preferences</li>
            <li>Proactive privacy impact assessments</li>
          </ul>
        </section>

        {/* New Section: Continuous Improvement */}
        <section className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <Globe className="mr-3 text-blue-600" size={30} />
            <h3 className="text-xl font-semibold text-blue-800">
              Continuous Compliance Evolution
            </h3>
          </div>
          <p className="mb-4 text-gray-700">
            We are committed to staying ahead of regulatory changes:
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <FileText className="mr-2 mt-1 text-blue-600" size={20} />
              <p className="text-gray-700">
                Dedicated compliance team tracking global regulatory landscapes
              </p>
            </div>
            <div className="flex items-start">
              <Inbox className="mr-2 mt-1 text-blue-600" size={20} />
              <p className="text-gray-700">
                Quarterly compliance and strategy review sessions
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default CompliancePage;
