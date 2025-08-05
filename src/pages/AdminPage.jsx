import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminPage = () => {
  const { currentUser, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Portal
          </h1>
          <p className="text-lg text-gray-600">
            Manage medical appointments and patient bookings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Access Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Admin Access
            </h2>

            {currentUser && userRole === "admin" ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Welcome, {currentUser.displayName || currentUser.email}!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    You are logged in as an administrator.
                  </p>
                </div>

                <Link
                  to="/admin/dashboard"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Admin Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Admin Login Required</strong>
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    Only authorized administrators can access the dashboard.
                  </p>
                </div>

                <Link
                  to="/admin/login"
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Admin Login
                </Link>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Need admin access?</strong>
                  </p>
                  <p>
                    Contact the system administrator to create an admin account.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">For Patients</h3>
                <p className="text-gray-600 text-sm">
                  • No login required
                  <br />
                  • Book appointments directly
                  <br />
                  • Information stored securely
                  <br />• Receive confirmation emails
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">For Admins</h3>
                <p className="text-gray-600 text-sm">
                  • Secure login required
                  <br />
                  • View all appointments
                  <br />
                  • Confirm/cancel bookings
                  <br />• Manage patient data
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">Data Storage</h3>
                <p className="text-gray-600 text-sm">
                  • Patient info in appointments
                  <br />
                  • Admin accounts in users
                  <br />
                  • Secure Firebase backend
                  <br />• Real-time updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Patient Bookings
            </h3>
            <p className="text-gray-600 text-sm">
              Patients can book appointments without creating accounts. Their
              information is stored securely with each booking.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-green-600 text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Admin Security
            </h3>
            <p className="text-gray-600 text-sm">
              Only authorized administrators can access the dashboard. Admin
              accounts are created separately from patient bookings.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-purple-600 text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Data Management
            </h3>
            <p className="text-gray-600 text-sm">
              All data is stored in Firebase Firestore with proper security
              rules. Admins can view, confirm, and manage all appointments.
            </p>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
