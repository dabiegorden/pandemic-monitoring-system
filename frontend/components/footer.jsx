import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">About</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/mission"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Our Mission
                </Link>
                <Link
                  href="/team"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Our Team
                </Link>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Careers
                </Link>
              </div>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/docs"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Documentation
                </Link>
                <Link
                  href="/api-reference"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  API Reference
                </Link>
                <Link
                  href="/guides"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Guides
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>

            {/* Legal Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Legal</h3>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Cookie Policy
                </Link>
                <Link
                  href="/compliance"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Compliance
                </Link>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">support@example.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    123 Business Ave, Suite 100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-600 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-800 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-500 text-sm text-center">
              © {currentYear} Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
