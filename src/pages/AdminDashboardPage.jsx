import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentsByStatus,
} from "../services/appointmentService";
import { runFirebaseTests } from "../utils/firebaseTest";

const AdminDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("checking");

  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  // Check connection and redirect if not admin
  useEffect(() => {
    const checkAccess = async () => {
      try {
        if (!currentUser) {
          console.log("No user logged in, redirecting to login...");
          navigate("/admin/login");
          return;
        }

        if (userRole !== "admin") {
          console.log("User is not admin, redirecting to login...");
          navigate("/admin/login");
          return;
        }

        console.log("Admin access confirmed, loading dashboard...");
        setConnectionStatus("connected");
        loadAppointments();
      } catch (error) {
        console.error("Error checking admin access:", error);
        setConnectionStatus("error");
        setError("Failed to verify admin access. Please try again.");
      }
    };

    checkAccess();
  }, [currentUser, userRole, navigate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Loading appointments with filter:", filter);

      let appointmentsData;

      if (filter === "all") {
        appointmentsData = await getAllAppointments();
      } else {
        appointmentsData = await getAppointmentsByStatus(filter);
      }

      console.log("Appointments loaded:", appointmentsData.length);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setError(
        "Failed to load appointments. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);
      setError("");

      console.log(
        `Updating appointment ${appointmentId} to status: ${newStatus}`
      );

      await updateAppointmentStatus(appointmentId, newStatus, currentUser.uid);
      await loadAppointments(); // Reload to get updated data

      console.log("Appointment status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update appointment status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        setError("");
        console.log("Deleting appointment:", appointmentId);

        await deleteAppointment(appointmentId);
        await loadAppointments();

        console.log("Appointment deleted successfully");
      } catch (error) {
        console.error("Error deleting appointment:", error);
        setError("Failed to delete appointment. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      setError("Failed to logout. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.facility?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Show loading or error states
  if (connectionStatus === "checking") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser || userRole !== "admin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage medical appointments</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {connectionStatus === "connected"
                  ? "Connected to Firebase"
                  : "Connection Error"}
              </span>
            </div>
            <button
              onClick={async () => {
                console.log("Running Firebase tests...");
                await runFirebaseTests();
              }}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Test Connection
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={loadAppointments}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Appointments ({filteredAppointments.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No appointments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.facility?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.facility?.address || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.service}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {appointment.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "confirmed")
                              }
                              disabled={updatingId === appointment.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {updatingId === appointment.id
                                ? "Confirming..."
                                : "Confirm"}
                            </button>
                          )}
                          {appointment.status === "confirmed" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment.id, "completed")
                              }
                              disabled={updatingId === appointment.id}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                            >
                              {updatingId === appointment.id
                                ? "Completing..."
                                : "Complete"}
                            </button>
                          )}
                          {appointment.status !== "cancelled" &&
                            appointment.status !== "completed" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    appointment.id,
                                    "cancelled"
                                  )
                                }
                                disabled={updatingId === appointment.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {updatingId === appointment.id
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </button>
                            )}
                          <button
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
