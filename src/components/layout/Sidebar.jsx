import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 z-40" : "opacity-0 -z-10"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/appointments"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Patient Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/accessibility"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Accessibility Features
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={onClose}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Accessibility Controls */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Accessibility Controls
            </h2>
            <div className="space-y-4">
              <button
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Increase text size"
              >
                Increase Text Size
              </button>
              <button
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle high contrast"
              >
                High Contrast
              </button>
              <button
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle screen reader mode"
              >
                Screen Reader Mode
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
