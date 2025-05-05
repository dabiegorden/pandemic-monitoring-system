import React from "react";
import { FileText, Shield, UserCheck, Settings } from "lucide-react";

const TermsOfServicePage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800 flex items-center">
        <FileText className="mr-4 text-blue-600" size={40} />
        Terms of Service
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          User Agreement
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          By using our Pandemic Monitoring System, you agree to the following
          terms:
        </p>
      </section>

      <div className="space-y-8 text-gray-700">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Usage Conditions
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Data is for informational purposes only</li>
            <li>Not to be used for medical diagnosis</li>
            <li>Requires professional interpretation</li>
            <li>Subject to ongoing updates and modifications</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Liability Disclaimer
          </h3>
          <p className="mb-4">
            Our system provides aggregated data and predictive models. We are
            not responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Direct medical decisions</li>
            <li>Interpretation without expert consultation</li>
            <li>Data accuracy beyond our current capabilities</li>
          </ul>
        </div>

        {/* New Data Privacy & Security Section */}
        <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
          <h3 className="text-xl font-semibold mb-4 text-emerald-800 flex items-center">
            <Shield className="mr-3 text-emerald-600" size={24} />
            Data Privacy & Security
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-700 mb-2">
                Data Collection
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Personal information is collected and processed in accordance
                  with GDPR and HIPAA regulations
                </li>
                <li>Anonymous aggregation of epidemic-related data</li>
                <li>Secure storage with industry-standard encryption</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-700 mb-2">
                Data Usage
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Strictly for pandemic monitoring and analysis purposes</li>
                <li>No sharing with third parties without explicit consent</li>
                <li>Regular security audits and compliance checks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* New User Responsibilities Section */}
        <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
          <h3 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
            <UserCheck className="mr-3 text-amber-600" size={24} />
            User Responsibilities
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-amber-700 mb-2">
                Account Security
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintain strong password security</li>
                <li>Report unauthorized access immediately</li>
                <li>No sharing of access credentials</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-amber-700 mb-2">
                Data Integrity
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Submit accurate information only</li>
                <li>Regular verification of submitted data</li>
                <li>Prompt reporting of data discrepancies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* New Service Modifications Section */}
        <div className="bg-violet-50 p-6 rounded-lg border-l-4 border-violet-500">
          <h3 className="text-xl font-semibold mb-4 text-violet-800 flex items-center">
            <Settings className="mr-3 text-violet-600" size={24} />
            Service Modifications
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-violet-700 mb-2">
                System Updates
              </h4>
              <p className="mb-3">We reserve the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Modify features and functionality without prior notice</li>
                <li>Update terms of service as needed</li>
                <li>Adjust data collection methods to improve accuracy</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-violet-700 mb-2">
                Service Availability
              </h4>
              <p>While we strive for 24/7 availability, we may need to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Perform scheduled maintenance</li>
                <li>Implement emergency updates</li>
                <li>Modify service access during critical situations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TermsOfServicePage;
