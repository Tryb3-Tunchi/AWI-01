import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import TestimonialsPage from "./pages/TestimonialsPage";

function App() {
  return (
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
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
