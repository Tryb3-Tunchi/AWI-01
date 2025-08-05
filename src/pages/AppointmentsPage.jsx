import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createAppointment } from "../services/appointmentService";

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const AppointmentsPage = () => {
  const [location, setLocation] = useState("");
  const [places, setPlaces] = useState([]);
  const [center, setCenter] = useState([6.5244, 3.3792]); // Default: Lagos
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("hospital");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Force map re-render
  const API_KEY = "f8a6d6d763bf490f916ebb74017a1952";

  // Voice-to-text states
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState("unknown");
  const recognitionRef = useRef(null);

  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    notes: "",
  });

  const categoryMap = {
    hospital: "healthcare.hospital",
    clinic: "healthcare.clinic",
    pharmacy: "healthcare.pharmacy",
    dentist: "healthcare.dentist",
  };

  const services = [
    { id: "general", name: "General Consultation", duration: "30 min" },
    { id: "specialist", name: "Specialist Consultation", duration: "45 min" },
    { id: "emergency", name: "Emergency Care", duration: "60 min" },
    { id: "followup", name: "Follow-up Appointment", duration: "20 min" },
    { id: "vaccination", name: "Vaccination", duration: "15 min" },
    { id: "screening", name: "Health Screening", duration: "90 min" },
  ];

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

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

        if (finalTranscript) {
          setLocation((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        setIsListening(false);

        if (event.error === "audio-capture") {
          setMicrophonePermission("denied");
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };
    }
  }, []);

  // Test microphone access
  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophonePermission("granted");
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone test failed:", error);
      setMicrophonePermission("denied");
      return false;
    }
  };

  // Voice-to-text functions
  const startVoiceRecording = async () => {
    if (recognitionRef.current && voiceSupported) {
      try {
        // Test microphone access first
        const microphoneAccess = await testMicrophone();

        if (!microphoneAccess) {
          alert("Please allow microphone access to use voice recording");
          return;
        }

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
    }
  };

  // Keyboard shortcuts for voice search
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl + V for voice search (when search input is focused)
      if (event.ctrlKey && event.key === "v" && voiceSupported) {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          activeElement.placeholder &&
          activeElement.placeholder.includes("location")
        ) {
          event.preventDefault();
          if (isRecording) {
            stopVoiceRecording();
          } else {
            startVoiceRecording();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isRecording, voiceSupported]);

  const handleSearch = async () => {
    if (!location) return;
    setLoading(true);

    try {
      const geoRes = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          location
        )}&apiKey=${API_KEY}`
      );

      const { lat, lon } = geoRes.data.features[0].properties;
      setCenter([lat, lon]);
      setMapKey((prev) => prev + 1); // Force map re-render

      const placeRes = await axios.get(
        `https://api.geoapify.com/v2/places?categories=${categoryMap[type]}&filter=circle:${lon},${lat},10000&limit=15&apiKey=${API_KEY}`
      );

      setPlaces(placeRes.data.features);
    } catch (error) {
      console.error("Search error:", error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setShowBookingForm(true);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Selected place properties:", selectedPlace.properties);

      const appointmentData = {
        ...bookingData,
        facility: {
          name: selectedPlace.properties.name || "Unknown Facility",
          address:
            selectedPlace.properties.address_line1 || "Address not available",
          city: selectedPlace.properties.city || "City not available",
          coordinates: {
            lat: selectedPlace.properties.lat || 0,
            lon: selectedPlace.properties.lon || 0,
          },
        },
      };

      console.log("Appointment data being sent:", appointmentData);

      const appointmentId = await createAppointment(appointmentData);
      console.log("Appointment booked successfully with ID:", appointmentId);

      // Close booking form immediately
      setShowBookingForm(false);
      setSelectedPlace(null);

      // Reset form data
      setBookingData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        service: "",
        notes: "",
      });

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Map component with error boundary
  const MapComponent = () => {
    if (!center || center.length !== 2) {
      return (
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Map loading...</p>
        </div>
      );
    }

    return (
      <MapContainer
        key={mapKey}
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${API_KEY}`}
          attribution="&copy; OpenStreetMap contributors"
        />
        {places.map((place, i) => (
          <Marker
            key={i}
            position={[place.properties.lat, place.properties.lon]}
          >
            <Popup>
              <div>
                <strong>{place.properties.name || "Unnamed"}</strong>
                <br />
                {place.properties.address_line1}
                <br />
                <button
                  onClick={() => handlePlaceSelect(place)}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Find & Book Medical Appointments
          </h1>
          <p className="text-lg text-gray-600">
            Search for nearby medical facilities and book your appointment
          </p>
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-3 justify-center mb-4">
            <button
              onClick={() => setType("hospital")}
              className={`px-4 py-2 rounded ${
                type === "hospital" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Hospitals
            </button>
            <button
              onClick={() => setType("clinic")}
              className={`px-4 py-2 rounded ${
                type === "clinic" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Clinics
            </button>
            <button
              onClick={() => setType("pharmacy")}
              className={`px-4 py-2 rounded ${
                type === "pharmacy" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Pharmacies
            </button>
            <button
              onClick={() => setType("dentist")}
              className={`px-4 py-2 rounded ${
                type === "dentist" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Dentists
            </button>
          </div>

          <div className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter your location or ZIP code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 pr-12 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {voiceSupported && (
                <button
                  onClick={
                    isRecording ? stopVoiceRecording : startVoiceRecording
                  }
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full focus:ring-2 focus:ring-blue-500 transition-all ${
                    isRecording
                      ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={
                    isRecording
                      ? "Stop voice recording"
                      : "Start voice recording"
                  }
                  title={isRecording ? "Stop recording" : "Voice search"}
                >
                  {isRecording ? "⏹️" : "🎤"}
                </button>
              )}
              {isListening && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center text-blue-600 text-sm">
                  <div className="animate-pulse mr-1">🔴</div>
                  Listening...
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {voiceSupported && (
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">
                💡 <strong>Voice Search:</strong> Click the microphone icon to
                search by voice. Try saying "hospitals near downtown" or
                "clinics in your Area"
              </p>
            </div>
          )}
        </div>

        {/* Results and Map */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Results List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Nearby {type.charAt(0).toUpperCase() + type.slice(1)}s
            </h2>
            {places.length === 0 && !loading && (
              <p className="text-gray-500">
                No {type}s found for this location. Try searching for a
                different area.
              </p>
            )}
            {places.map((place, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-blue-500"
              >
                <h3 className="font-bold text-lg mb-2">
                  {place.properties.name || "Unnamed Facility"}
                </h3>
                <p className="text-gray-600 mb-1">
                  {place.properties.address_line1}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {place.properties.city}
                </p>
                <button
                  onClick={() => handlePlaceSelect(place)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="h-[500px] rounded-lg overflow-hidden shadow">
            <MapComponent />
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && selectedPlace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Book Appointment</h3>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="font-medium">{selectedPlace.properties.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedPlace.properties.address_line1}
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleBookingInputChange}
                        required
                        min={getMinDate()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time *
                      </label>
                      <select
                        name="time"
                        value={bookingData.time}
                        onChange={handleBookingInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service *
                    </label>
                    <select
                      name="service"
                      value={bookingData.service}
                      onChange={handleBookingInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} ({service.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <div className="relative">
                      <textarea
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleBookingInputChange}
                        rows="3"
                        className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Any special requirements or symptoms..."
                      />
                      {voiceSupported && (
                        <button
                          type="button"
                          onClick={() => {
                            // Create a temporary voice input for notes
                            const tempRecognition =
                              new (window.SpeechRecognition ||
                                window.webkitSpeechRecognition)();
                            tempRecognition.continuous = false;
                            tempRecognition.interimResults = false;
                            tempRecognition.lang = "en-US";

                            tempRecognition.onresult = (event) => {
                              const transcript = event.results[0][0].transcript;
                              setBookingData((prev) => ({
                                ...prev,
                                notes: prev.notes + transcript,
                              }));
                            };

                            tempRecognition.start();
                          }}
                          className="absolute right-2 top-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
                          aria-label="Add notes using voice"
                          title="Voice input for notes"
                        >
                          🎤
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Booking...
                        </span>
                      ) : (
                        "Book Appointment"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Appointment Booked Successfully!
              </h3>
              <p className="text-green-700 mb-4">
                Thank you for booking your appointment. You will receive a
                confirmation email shortly.
              </p>
              <p className="text-green-600 mb-6">
                Please arrive 10 minutes before your scheduled time.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    // Optionally refresh the page or reset search
                    setPlaces([]);
                    setLocation("");
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Book Another Appointment
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
