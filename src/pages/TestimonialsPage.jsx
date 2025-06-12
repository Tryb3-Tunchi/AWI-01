import React from "react";
import Testimonials from "../components/Testimonials";

const TestimonialsPage = () => {
  return (
    <main className="min-h-screen py-12" role="main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12">
          Patient Testimonials
        </h1>

        {/* Featured Testimonials Carousel */}
        <Testimonials />

        {/* Submit Testimonial Form */}
        <section className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Share Your Experience</h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Select a rating</option>
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="3">3 Stars - Good</option>
                <option value="2">2 Stars - Fair</option>
                <option value="1">1 Star - Poor</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="testimonial"
                className="block text-sm font-medium text-gray-700"
              >
                Your Testimonial
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Submit Testimonial
              </button>
            </div>
          </form>
        </section>

        {/* Additional Information */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Why Share Your Story?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Help Others</h3>
              <p className="text-gray-600">
                Your experience can help others make informed decisions about
                their healthcare.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Improve Services</h3>
              <p className="text-gray-600">
                Your feedback helps us continuously improve our services and
                accessibility features.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Build Community</h3>
              <p className="text-gray-600">
                Join our community of patients and share your journey with
                others.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TestimonialsPage;
