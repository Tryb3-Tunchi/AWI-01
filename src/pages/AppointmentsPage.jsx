import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Force map re-render
  const API_KEY = "f8a6d6d763bf490f916ebb74017a1952";

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

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment booked:", {
      ...bookingData,
      facility: selectedPlace,
    });
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setShowBookingForm(false);
      setSelectedPlace(null);
      setBookingData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        service: "",
        notes: "",
      });
    }, 3000);
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              Appointment Booked Successfully!
            </h1>
            <p className="text-green-700 mb-4">
              Thank you for booking your appointment at{" "}
              {selectedPlace?.properties.name}. We've sent a confirmation email
              to {bookingData.email}.
            </p>
            <p className="text-green-600">
              Please arrive 10 minutes before your scheduled time.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <input
              type="text"
              placeholder="Enter your location or ZIP code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                    <textarea
                      name="notes"
                      value={bookingData.notes}
                      onChange={handleBookingInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special requirements or symptoms..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Book Appointment
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
      </div>
    </div>
  );
};

export default AppointmentsPage;
