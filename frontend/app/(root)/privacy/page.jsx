import React from "react";
import {
  Shield,
  Lock,
  UserCog,
  FileCheck,
  Server,
  Key,
  Eye,
  Clock,
} from "lucide-react";

const PrivacyPolicyPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-800 flex items-center">
        <Shield className="mr-4 text-blue-600" size={40} />
        Privacy Policy
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Data Protection in Pandemic Monitoring
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          At Pandemic Monitoring System, we are committed to protecting your
          personal information and maintaining the highest standards of data
          privacy.
        </p>
      </section>

      <div className="space-y-8 text-gray-700">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Types of Data We Collect
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Anonymized health statistics</li>
            <li>Aggregated regional data</li>
            <li>System usage information</li>
            <li>Contact information for authorized personnel</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Data Protection Principles
          </h3>
          <p className="mb-4">
            We adhere to strict data protection guidelines, ensuring:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Complete anonymization of individual health data</li>
            <li>Encrypted data transmission</li>
            <li>Limited data retention periods</li>
            <li>Transparent data usage policies</li>
          </ul>
        </div>

        {/* New Data Security Measures Section */}
        <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-500">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
            <Lock className="mr-3" size={24} />
            Data Security Measures
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Server className="mr-3 text-slate-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">
                  Secure Infrastructure
                </h4>
                <p className="text-slate-600">
                  Enterprise-grade servers with 24/7 monitoring and automated
                  threat detection
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Key className="mr-3 text-slate-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">
                  Encryption Standards
                </h4>
                <p className="text-slate-600">
                  AES-256 encryption for data at rest and TLS 1.3 for data in
                  transit
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Eye className="mr-3 text-slate-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">
                  Access Controls
                </h4>
                <p className="text-slate-600">
                  Role-based access control with multi-factor authentication
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="mr-3 text-slate-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">
                  Regular Audits
                </h4>
                <p className="text-slate-600">
                  Quarterly security audits and penetration testing by
                  third-party experts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New User Rights & Controls Section */}
        <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
          <h3 className="text-xl font-semibold mb-4 text-emerald-800 flex items-center">
            <UserCog className="mr-3" size={24} />
            User Rights & Controls
          </h3>
          <div className="space-y-4">
            <p className="text-emerald-900">
              We ensure that all users have complete control over their data and
              can exercise their rights under applicable privacy laws.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-700 mb-2">
                  Access Rights
                </h4>
                <ul className="space-y-2 text-emerald-800">
                  <li>• Request data access reports</li>
                  <li>• View collected information</li>
                  <li>• Download personal data</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-700 mb-2">
                  Control Options
                </h4>
                <ul className="space-y-2 text-emerald-800">
                  <li>• Update preferences</li>
                  <li>• Opt-out choices</li>
                  <li>• Data deletion requests</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* New Compliance & Reporting Section */}
        <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-xl font-semibold mb-4 text-purple-800 flex items-center">
            <FileCheck className="mr-3" size={24} />
            Compliance & Reporting
          </h3>
          <div className="space-y-4">
            <p className="text-purple-900">
              Our privacy practices comply with global data protection
              regulations.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg text-center">
                <h4 className="font-semibold text-purple-700 mb-2">GDPR</h4>
                <p className="text-sm text-purple-800">
                  European Union Data Protection
                </p>
                <div className="mt-2 text-purple-600">Compliant</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <h4 className="font-semibold text-purple-700 mb-2">HIPAA</h4>
                <p className="text-sm text-purple-800">
                  Health Information Privacy
                </p>
                <div className="mt-2 text-purple-600">Certified</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center">
                <h4 className="font-semibold text-purple-700 mb-2">CCPA</h4>
                <p className="text-sm text-purple-800">
                  California Consumer Privacy
                </p>
                <div className="mt-2 text-purple-600">Compliant</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">
                Annual Reports
              </h4>
              <p className="text-purple-800">
                We publish annual transparency reports detailing our privacy
                practices, data requests, and compliance metrics. These reports
                are available to all stakeholders and regulatory bodies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicyPage;
