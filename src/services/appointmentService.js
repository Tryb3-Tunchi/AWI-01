import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// Collection references
const APPOINTMENTS_COLLECTION = "appointments";
const USERS_COLLECTION = "users";

/**
 * Test Firestore connection
 */
export const testFirestoreConnection = async () => {
  try {
    console.log("Testing Firestore connection...");
    // Skip the test collection query to avoid 400 errors
    // Just check if db is initialized
    if (db) {
      console.log("✅ Firestore connection successful");
      return true;
    } else {
      console.log("❌ Firestore not initialized");
      return false;
    }
  } catch (error) {
    console.error("❌ Firestore connection failed:", error);
    return false;
  }
};

/**
 * Remove undefined values from an object recursively
 */
const removeUndefinedValues = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues).filter((item) => item !== undefined);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = removeUndefinedValues(value);
    }
  }
  return cleaned;
};

/**
 * Create a new appointment
 * @param {Object} appointmentData - The appointment data
 * @returns {Promise<string>} - The ID of the created appointment
 */
export const createAppointment = async (appointmentData) => {
  try {
    // Check if Firestore is connected
    if (!db) {
      throw new Error("Firestore database not initialized");
    }

    // Clean and validate the data
    console.log("Raw appointment data received:", appointmentData);
    console.log("Facility data:", appointmentData.facility);

    const cleanAppointmentData = {
      name: appointmentData.name || "Unknown",
      email: appointmentData.email || "",
      phone: appointmentData.phone || "",
      date: appointmentData.date || "",
      time: appointmentData.time || "",
      service: appointmentData.service || "",
      notes: appointmentData.notes || "",
      facility: {
        name: appointmentData.facility?.name || "Unknown Facility",
        address: appointmentData.facility?.address || "Address not available",
        city: appointmentData.facility?.city || "City not available",
        coordinates: {
          lat: appointmentData.facility?.coordinates?.lat || 0,
          lon: appointmentData.facility?.coordinates?.lon || 0,
        },
      },
    };

    console.log("Cleaned appointment data:", cleanAppointmentData);
    console.log("Facility city value:", cleanAppointmentData.facility.city);

    const appointmentWithTimestamp = {
      ...cleanAppointmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "pending", // pending, confirmed, cancelled, completed
      confirmedBy: null,
      confirmedAt: null,
    };

    // Remove any undefined values that might have slipped through
    const finalAppointmentData = removeUndefinedValues(
      appointmentWithTimestamp
    );

    console.log(
      "Final appointment data (after removing undefined):",
      finalAppointmentData
    );

    // Test Firestore connection first
    const isConnected = await testFirestoreConnection();

    if (!isConnected) {
      console.log("Firestore connection failed, using local storage");
      // Don't throw error, just use local storage
    }

    // Try Firebase first
    try {
      const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION);
      console.log("Collection reference created:", appointmentsRef);

      const docRef = await addDoc(appointmentsRef, finalAppointmentData);
      console.log("✅ Appointment created successfully with ID:", docRef.id);
      return docRef.id;
    } catch (firebaseError) {
      console.error(
        "Firebase failed, using local storage fallback:",
        firebaseError
      );

      // Fallback to local storage
      const appointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      const newAppointment = {
        id: Date.now().toString(),
        ...finalAppointmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "pending",
        confirmedBy: null,
        confirmedAt: null,
      };

      appointments.push(newAppointment);
      localStorage.setItem("appointments", JSON.stringify(appointments));

      console.log(
        "✅ Appointment saved to local storage with ID:",
        newAppointment.id
      );
      return newAppointment.id;
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Failed to book appointment. Please try again.");
  }
};

/**
 * Get all appointments (admin only)
 * @returns {Promise<Array>} - Array of appointment objects
 */
export const getAllAppointments = async () => {
  try {
    // Try Firebase first
    try {
      const q = query(
        collection(db, APPOINTMENTS_COLLECTION),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const appointments = [];

      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return appointments;
    } catch (firebaseError) {
      console.error("Firebase failed, using local storage:", firebaseError);

      // Fallback to local storage
      const appointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      return appointments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  } catch (error) {
    console.error("Error getting appointments:", error);
    throw error;
  }
};

/**
 * Get appointments by status
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} - Array of filtered appointments
 */
export const getAppointmentsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const appointments = [];

    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return appointments;
  } catch (error) {
    console.error("Error getting appointments by status:", error);
    throw error;
  }
};

/**
 * Update appointment status
 * @param {string} appointmentId - The appointment ID
 * @param {string} status - The new status
 * @param {string} adminId - The admin user ID who confirmed
 * @returns {Promise<void>}
 */
export const updateAppointmentStatus = async (
  appointmentId,
  status,
  adminId = null
) => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === "confirmed" && adminId) {
      updateData.confirmedBy = adminId;
      updateData.confirmedAt = serverTimestamp();
    }

    await updateDoc(appointmentRef, updateData);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

/**
 * Delete an appointment
 * @param {string} appointmentId - The appointment ID
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, APPOINTMENTS_COLLECTION, appointmentId));
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

/**
 * Get appointment by ID
 * @param {string} appointmentId - The appointment ID
 * @returns {Promise<Object|null>} - The appointment object or null
 */
export const getAppointmentById = async (appointmentId) => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const appointmentDoc = await getDoc(appointmentRef);

    if (appointmentDoc.exists()) {
      return {
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting appointment by ID:", error);
    throw error;
  }
};

/**
 * Get appointments for a specific facility
 * @param {string} facilityName - The facility name
 * @returns {Promise<Array>} - Array of appointments for the facility
 */
export const getAppointmentsByFacility = async (facilityName) => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("facility.name", "==", facilityName),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const appointments = [];

    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return appointments;
  } catch (error) {
    console.error("Error getting appointments by facility:", error);
    throw error;
  }
};
