import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50" role="contentinfo">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contact Us</h2>
            <p className="mt-4 text-gray-600">
              Emergency: 999
              <br />
              Non-emergency: 111
              <br />
              Email: contact@medicalportal.com
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/accessibility"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Accessibility
            </h2>
            <p className="mt-4 text-gray-600">
              This website is designed to be accessible to all users. If you
              experience any issues, please contact our support team.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Medical Portal. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
