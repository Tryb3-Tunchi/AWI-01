import React, { useState, useRef, useEffect } from "react";
import Testimonials from "../components/Testimonials";

const TestimonialsPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    testimonial: "",
  });

  // Voice-to-text states
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recordingField, setRecordingField] = useState(null); // Track which field is being recorded
  const recognitionRef = useRef(null);

  // Voice recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setVoiceSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript && recordingField) {
          setFormData((prev) => ({
            ...prev,
            [recordingField]: prev[recordingField] + finalTranscript,
          }));
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        setIsListening(false);
        setRecordingField(null);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
        setRecordingField(null);
      };
    }
  }, [recordingField]);

  // Voice recording functions
  const startVoiceRecording = (fieldName) => {
    if (recognitionRef.current && voiceSupported) {
      try {
        setRecordingField(fieldName);
        recognitionRef.current.start();
        setIsRecording(true);
        setIsListening(true);
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
      setRecordingField(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Testimonial submitted:", formData);
    // Here you would typically send the data to your backend
    alert(
      "Thank you for sharing your story! Your testimonial has been submitted."
    );
    setFormData({
      name: "",
      email: "",
      rating: "",
      testimonial: "",
    });
  };

  // Keyboard shortcuts for voice recording
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl + V for voice recording (when form inputs are focused)
      if (event.ctrlKey && event.key === "v" && voiceSupported) {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          activeElement.name &&
          ["name", "email", "testimonial"].includes(activeElement.name)
        ) {
          event.preventDefault();
          const fieldName = activeElement.name;
          if (recordingField === fieldName && isRecording) {
            stopVoiceRecording();
          } else {
            startVoiceRecording(fieldName);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isRecording, voiceSupported, recordingField]);

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

          {/* Voice Recording Status */}
          {isListening && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-blue-700">
                <div className="animate-pulse mr-2">🔴</div>
                <span className="font-medium">Recording your story...</span>
                <button
                  onClick={stopVoiceRecording}
                  className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Stop Recording
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-12"
                  required
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={() =>
                      recordingField === "name"
                        ? stopVoiceRecording()
                        : startVoiceRecording("name")
                    }
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full focus:ring-2 focus:ring-primary-500 transition-all ${
                      recordingField === "name" && isRecording
                        ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={
                      recordingField === "name" && isRecording
                        ? "Stop recording name"
                        : "Record name using voice"
                    }
                    title="Voice input for name"
                  >
                    {recordingField === "name" && isRecording ? "⏹️" : "🎤"}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-12"
                  required
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={() =>
                      recordingField === "email"
                        ? stopVoiceRecording()
                        : startVoiceRecording("email")
                    }
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full focus:ring-2 focus:ring-primary-500 transition-all ${
                      recordingField === "email" && isRecording
                        ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={
                      recordingField === "email" && isRecording
                        ? "Stop recording email"
                        : "Record email using voice"
                    }
                    title="Voice input for email"
                  >
                    {recordingField === "email" && isRecording ? "⏹️" : "🎤"}
                  </button>
                )}
              </div>
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
                value={formData.rating}
                onChange={handleInputChange}
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
                Your Testimonial Story
              </label>
              <div className="relative">
                <textarea
                  id="testimonial"
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  rows="6"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-12"
                  placeholder="Share your experience with our medical services. You can type or use voice recording to tell your story..."
                  required
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={() =>
                      recordingField === "testimonial"
                        ? stopVoiceRecording()
                        : startVoiceRecording("testimonial")
                    }
                    className={`absolute right-2 top-2 p-2 rounded-full focus:ring-2 focus:ring-primary-500 transition-all ${
                      recordingField === "testimonial" && isRecording
                        ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={
                      recordingField === "testimonial" && isRecording
                        ? "Stop recording testimonial"
                        : "Record testimonial using voice"
                    }
                    title="Voice input for testimonial"
                  >
                    {recordingField === "testimonial" && isRecording
                      ? "⏹️"
                      : "🎤"}
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                💡 <strong>Voice Recording:</strong> Click the microphone icon
                to record your story by voice. Perfect for sharing detailed
                experiences and emotions.
              </p>
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

        {/* Voice Recording Feature Highlight */}
        {voiceSupported && (
          <section className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🎤</div>
              <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                Share Your Story with Voice
              </h2>
              <p className="text-blue-700">
                Use voice recording to tell your story naturally and
                authentically
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">
                  🎯 Perfect for Storytelling
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Speak naturally about your experience</li>
                  <li>• Capture emotions and personal details</li>
                  <li>• No need to type long stories</li>
                  <li>• Ideal for users with motor difficulties</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">
                  🚀 How to Use Voice Recording
                </h3>
                <ol className="text-gray-700 space-y-2">
                  <li>1. Click the microphone icon next to any field</li>
                  <li>2. Speak clearly about your experience</li>
                  <li>3. Click the stop button when finished</li>
                  <li>4. Review and edit the transcribed text</li>
                </ol>
              </div>
            </div>
          </section>
        )}

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
