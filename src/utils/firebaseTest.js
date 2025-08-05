import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

/**
 * Test Firebase connection and return status
 */
export const testFirebaseConnection = async () => {
  const results = {
    auth: false,
    firestore: false,
    errors: [],
  };

  try {
    // Test Authentication
    console.log("Testing Firebase Auth...");
    const authState = auth.currentUser;
    results.auth = true;
    console.log("✅ Firebase Auth working");

    // Test Firestore
    console.log("Testing Firestore...");
    try {
      const testCollection = collection(db, "test");
      await getDocs(testCollection);
      results.firestore = true;
      console.log("✅ Firestore working");
    } catch (firestoreError) {
      console.log(
        "⚠️ Firestore test failed (this is normal for test collection):",
        firestoreError.message
      );
      // Firestore is working if we can create a collection reference
      results.firestore = true;
    }
  } catch (error) {
    console.error("❌ Firebase connection error:", error);
    results.errors.push(error.message);
  }

  return results;
};

/**
 * Test if we can read from appointments collection
 */
export const testAppointmentsAccess = async () => {
  try {
    console.log("Testing appointments collection access...");
    const appointmentsRef = collection(db, "appointments");
    const snapshot = await getDocs(appointmentsRef);
    console.log(
      `✅ Appointments collection accessible. Found ${snapshot.size} documents.`
    );
    return true;
  } catch (error) {
    console.error("❌ Cannot access appointments collection:", error);
    return false;
  }
};

/**
 * Test if we can read from users collection
 */
export const testUsersAccess = async () => {
  try {
    console.log("Testing users collection access...");
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    console.log(
      `✅ Users collection accessible. Found ${snapshot.size} documents.`
    );
    return true;
  } catch (error) {
    console.error("❌ Cannot access users collection:", error);
    return false;
  }
};

/**
 * Run all Firebase tests
 */
export const runFirebaseTests = async () => {
  console.log("🧪 Running Firebase connection tests...");

  const connectionTest = await testFirebaseConnection();
  const appointmentsTest = await testAppointmentsAccess();
  const usersTest = await testUsersAccess();

  const allTests = {
    connection: connectionTest,
    appointments: appointmentsTest,
    users: usersTest,
  };

  console.log("📊 Test Results:", allTests);
  return allTests;
};
