import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Us",
      details: [
        "123 Medical Center Drive",
        "Healthcare District",
        "City, State 12345",
      ],
    },
    {
      icon: "📞",
      title: "Call Us",
      details: [
        "Main: (555) 123-4567",
        "Emergency: (555) 911-0000",
        "Fax: (555) 123-4568",
      ],
    },
    {
      icon: "✉️",
      title: "Email Us",
      details: [
        "info@medicare.com",
        "support@medicare.com",
        "emergency@medicare.com",
      ],
    },
    {
      icon: "🕒",
      title: "Hours",
      details: [
        "Monday - Friday: 8:00 AM - 8:00 PM",
        "Saturday: 9:00 AM - 6:00 PM",
        "Sunday: 10:00 AM - 4:00 PM",
      ],
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-green-700 mb-4">
              Thank you for contacting us. We'll get back to you within 24
              hours.
            </p>
            <p className="text-green-600">
              For urgent matters, please call our emergency line.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" role="main">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Get in touch with our healthcare team. We're here to help you with
            any questions or concerns.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600">
              Multiple ways to reach our healthcare professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg text-center"
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as
              possible
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What is this regarding?"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your inquiry or concern..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Our Location</h2>
            <p className="text-lg text-gray-600">
              Visit us at our state-of-the-art medical facility
            </p>
          </div>

          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-600">
                Interactive map will be displayed here
              </p>
              <p className="text-sm text-gray-500 mt-2">
                123 Medical Center Drive, Healthcare District
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="text-red-600 text-4xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Emergency Contact
            </h2>
            <p className="text-red-700 mb-4">
              For medical emergencies, please call our emergency line
              immediately:
            </p>
            <p className="text-2xl font-bold text-red-600 mb-4">
              (555) 911-0000
            </p>
            <p className="text-red-600">
              Available 24/7 for urgent medical care
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
