import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();

  const medicalServices = [
    {
      id: "general-consultation",
      title: "General Consultation",
      icon: "👨‍⚕️",
      description:
        "Comprehensive health check-ups and general medical consultations with our experienced physicians.",
      duration: "30-45 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Health assessment and physical examination",
        "Medical history review",
        "Diagnostic recommendations",
        "Treatment plans and prescriptions",
        "Follow-up scheduling",
      ],
      category: "Primary Care",
    },
    {
      id: "specialist-consultation",
      title: "Specialist Consultation",
      icon: "🏥",
      description:
        "Expert consultations with specialized medical professionals for specific health conditions.",
      duration: "45-60 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Specialized medical expertise",
        "Advanced diagnostic procedures",
        "Comprehensive treatment plans",
        "Referral coordination",
        "Specialized follow-up care",
      ],
      category: "Specialized Care",
    },
    {
      id: "emergency-care",
      title: "Emergency Care",
      icon: "🚨",
      description:
        "24/7 emergency medical services for urgent health situations and critical care.",
      duration: "Immediate",
      pricing: "Contact for Pricing",
      features: [
        "24/7 emergency response",
        "Critical care treatment",
        "Emergency diagnostics",
        "Stabilization services",
        "Emergency transport coordination",
      ],
      category: "Emergency",
    },
    {
      id: "laboratory-services",
      title: "Laboratory Services",
      icon: "🔬",
      description:
        "Comprehensive diagnostic testing and laboratory services for accurate health assessments.",
      duration: "15-30 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Blood tests and analysis",
        "Urine and stool tests",
        "Hormone level testing",
        "Infection screening",
        "Rapid test results",
      ],
      category: "Diagnostics",
    },
    {
      id: "imaging-services",
      title: "Imaging Services",
      icon: "📷",
      description:
        "Advanced medical imaging services including X-rays, ultrasounds, and CT scans.",
      duration: "30-60 minutes",
      pricing: "Contact for Pricing",
      features: [
        "X-ray imaging",
        "Ultrasound scans",
        "CT scans",
        "MRI services",
        "Radiology consultation",
      ],
      category: "Diagnostics",
    },
    {
      id: "vaccination",
      title: "Vaccination Services",
      icon: "💉",
      description:
        "Comprehensive vaccination services for children and adults with proper immunization schedules.",
      duration: "15-30 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Childhood vaccinations",
        "Adult immunizations",
        "Travel vaccines",
        "Flu shots",
        "Vaccination records",
      ],
      category: "Preventive Care",
    },
    {
      id: "dental-care",
      title: "Dental Care",
      icon: "🦷",
      description:
        "Complete dental services including check-ups, cleanings, and specialized dental treatments.",
      duration: "30-90 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Dental check-ups",
        "Teeth cleaning",
        "Cavity fillings",
        "Root canal treatment",
        "Dental surgery",
      ],
      category: "Dental",
    },
    {
      id: "physiotherapy",
      title: "Physiotherapy",
      icon: "🦴",
      description:
        "Professional physiotherapy services for rehabilitation, pain management, and mobility improvement.",
      duration: "45-60 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Pain management",
        "Rehabilitation therapy",
        "Sports injury treatment",
        "Post-surgery recovery",
        "Mobility assessment",
      ],
      category: "Rehabilitation",
    },
    {
      id: "mental-health",
      title: "Mental Health Services",
      icon: "🧠",
      description:
        "Professional mental health support including counseling, therapy, and psychiatric care.",
      duration: "45-60 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Individual counseling",
        "Group therapy sessions",
        "Psychiatric evaluation",
        "Stress management",
        "Crisis intervention",
      ],
      category: "Mental Health",
    },
    {
      id: "pediatric-care",
      title: "Pediatric Care",
      icon: "👶",
      description:
        "Specialized medical care for infants, children, and adolescents with child-friendly approach.",
      duration: "30-45 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Child health check-ups",
        "Growth monitoring",
        "Childhood vaccinations",
        "Developmental screening",
        "Parent consultation",
      ],
      category: "Pediatric",
    },
    {
      id: "women-health",
      title: "Women's Health",
      icon: "👩‍⚕️",
      description:
        "Comprehensive women's health services including gynecology, prenatal care, and family planning.",
      duration: "30-60 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Gynecological exams",
        "Prenatal care",
        "Family planning",
        "Breast health screening",
        "Menopause care",
      ],
      category: "Women's Health",
    },
    {
      id: "nutrition-counseling",
      title: "Nutrition Counseling",
      icon: "🥗",
      description:
        "Professional nutrition guidance and dietary planning for optimal health and wellness.",
      duration: "30-45 minutes",
      pricing: "Contact for Pricing",
      features: [
        "Dietary assessment",
        "Personalized meal plans",
        "Weight management",
        "Medical nutrition therapy",
        "Nutritional education",
      ],
      category: "Wellness",
    },
  ];

  const categories = [
    ...new Set(medicalServices.map((service) => service.category)),
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBookAppointment = () => {
    navigate("/appointments");
    setShowBookingModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Medical Services
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Comprehensive healthcare services delivered with compassion,
            expertise, and the latest medical technology.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Services</h2>
            <p className="text-lg text-gray-600">
              We offer a wide range of medical services to meet all your
              healthcare needs
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedService(null)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              All Services
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedService({ category })}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalServices
              .filter(
                (service) =>
                  !selectedService ||
                  service.category === selectedService.category
              )
              .map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pricing:</span>
                      <span className="font-medium text-blue-600">
                        {service.pricing}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{service.category}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Services Include:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleServiceClick(service)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-gray-600">
              We are committed to providing the highest quality healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-lg font-semibold mb-2">Expert Physicians</h3>
              <p className="text-gray-600">
                Experienced and qualified medical professionals
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-lg font-semibold mb-2">Modern Facilities</h3>
              <p className="text-gray-600">
                State-of-the-art medical equipment and facilities
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-semibold mb-2">Convenient Hours</h3>
              <p className="text-gray-600">
                Flexible scheduling and extended hours
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-lg font-semibold mb-2">
                Patient-Centered Care
              </h3>
              <p className="text-gray-600">
                Personalized care with compassion and respect
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-red-800">
              Emergency Services
            </h2>
            <p className="text-lg text-red-700">
              Available 24/7 for urgent medical care
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🚨</div>
            <h3 className="text-2xl font-bold mb-4">Emergency Hotline</h3>
            <p className="text-3xl font-bold text-red-600 mb-4">
              0800-EMERGENCY
            </p>
            <p className="text-gray-600 mb-6">
              Call immediately for emergency medical assistance
            </p>
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Call Emergency
            </button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{selectedService.icon}</div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedService.title}
              </h3>
              <p className="text-gray-600">{selectedService.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{selectedService.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pricing:</span>
                <span className="font-medium text-blue-600">
                  {selectedService.pricing}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBookAppointment}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
