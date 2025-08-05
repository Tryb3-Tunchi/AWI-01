import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Skip to content link for keyboard users */}
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>

          <Header />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
