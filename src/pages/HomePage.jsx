import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Testimonials from "../components/Testimonials";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const [expandedNews, setExpandedNews] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      specialty: "Primary Care",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      description: "Specializing in accessible healthcare for all patients.",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      description:
        "Expert in neurological care with a focus on patient comfort.",
    },
    {
      id: 3,
      name: "Dr. Emma Thompson",
      specialty: "Pediatrics",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      description: "Dedicated to providing accessible care for children.",
    },
  ];

  const newsItems = [
    {
      id: 1,
      title: "New Accessibility Features Added",
      date: "March 15, 2024",
      summary:
        "We've implemented new features to make our website more accessible for all users.",
      content:
        "Detailed information about our new accessibility features, including screen reader improvements, keyboard navigation enhancements, and high contrast mode options.",
    },
    {
      id: 2,
      title: "Extended Hours for Emergency Care",
      date: "March 10, 2024",
      summary: "Our emergency care services are now available 24/7.",
      content:
        "Full details about our expanded emergency care services, including new staff additions and facility improvements.",
    },
    {
      id: 3,
      title: "New Specialist Joins Our Team",
      date: "March 5, 2024",
      summary: "Welcome Dr. James Wilson to our neurology department.",
      content:
        "Complete profile of Dr. Wilson, including his expertise, experience, and the new services he'll be offering.",
    },
  ];

  const heroImages = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      alt: "Modern medical facility",
      title: "Welcome to MediCare",
      subtitle: "Providing accessible healthcare services for everyone",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1587351021759-3e566b6af7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      alt: "Medical team consultation",
      title: "Expert Medical Care",
      subtitle: "Dedicated team of healthcare professionals",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      alt: "Patient care",
      title: "Patient-Centered Approach",
      subtitle: "Your health and comfort are our priority",
    },
  ];

  const sponsors = [
    {
      id: 1,
      name: "HealthCare Plus",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      type: "Insurance Partner",
    },
    {
      id: 2,
      name: "MediTech Solutions",
      logo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      type: "Technology Partner",
    },
    {
      id: 3,
      name: "Global Health Initiative",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      type: "Research Partner",
    },
    {
      id: 4,
      name: "Accessibility First",
      logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      type: "Accessibility Partner",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % doctors.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [doctors.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <main className="min-h-screen" role="main">
      {/* Main Hero Section with Image Carousel */}
      <section className="relative h-[80vh] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImageSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.image}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="max-w-3xl px-4">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  {image.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8">{image.subtitle}</p>
                <Link
                  to="/appointments"
                  className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageSlide(index)}
              className={`w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white ${
                currentImageSlide === index ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Write-up Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Our Commitment to Accessible Healthcare
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At MediCare, we believe that quality healthcare should be
              accessible to everyone. Our state-of-the-art facilities and
              dedicated team of healthcare professionals work together to
              provide comprehensive medical services while ensuring that every
              patient receives personalized care in a comfortable and accessible
              environment.
            </p>
            <p className="text-lg text-gray-600">
              We continuously invest in technology and training to improve our
              services and make healthcare more accessible for people with
              disabilities. From our accessible website to our specially
              designed facilities, every aspect of MediCare is built with
              inclusivity in mind.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsors/Supporters Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">
            Our Trusted Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="flex flex-col items-center p-4">
                <div className="w-32 h-32 mb-4 rounded-lg overflow-hidden bg-white shadow-md">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-1">
                  {sponsor.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {sponsor.type}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Together with our partners, we're building a more accessible and
              inclusive healthcare system.
            </p>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Important Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "COVID-19 Updates",
                content:
                  "Latest information about our COVID-19 protocols and vaccination services.",
                icon: "🦠",
              },
              {
                title: "Insurance Information",
                content:
                  "Details about accepted insurance plans and payment options.",
                icon: "💳",
              },
              {
                title: "Accessibility Services",
                content:
                  "Information about our accessibility features and support services.",
                icon: "♿",
              },
              {
                title: "Emergency Care",
                content:
                  "Guidelines for emergency situations and after-hours care.",
                icon: "🚑",
              },
            ].map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.content}</p>
                <button className="mt-4 text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <div key={news.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{news.date}</p>
                <p className="text-gray-600 mb-4">{news.summary}</p>
                <button
                  onClick={() =>
                    setExpandedNews(expandedNews === news.id ? null : news.id)
                  }
                  className="text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  {expandedNews === news.id ? "Read Less" : "Read More"}
                </button>
                {expandedNews === news.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="text-gray-700">{news.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Carousel */}
      <section className="py-16" aria-labelledby="doctors-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="doctors-heading"
            className="text-3xl font-bold text-center mb-12"
          >
            Meet Our Doctors
          </h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                      <img
                        src={doctor.image}
                        alt={`${doctor.name}'s profile`}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {doctor.name}
                      </h3>
                      <p className="text-primary-600 mb-2">
                        {doctor.specialty}
                      </p>
                      <p className="text-gray-600">{doctor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + doctors.length) % doctors.length
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Previous doctor"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % doctors.length)
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Next doctor"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Accessibility Features Section */}
      <section className="py-16" aria-labelledby="accessibility-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="accessibility-heading"
            className="text-3xl font-bold text-center mb-12"
          >
            Accessibility Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                For Visually Impaired Users
              </h3>
              <ul className="space-y-2">
                <li>• Screen reader compatibility</li>
                <li>• High contrast mode</li>
                <li>• Adjustable text size</li>
                <li>• Keyboard navigation</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                For Neurodivergent Users
              </h3>
              <ul className="space-y-2">
                <li>• Clear, simple language</li>
                <li>• Consistent navigation</li>
                <li>• Reduced motion options</li>
                <li>• Focus mode</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-16 bg-primary-600 text-white"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8">
            Book your appointment today and experience our accessible healthcare
            services.
          </p>
          <Link
            to="/appointments"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
          >
            Schedule Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
