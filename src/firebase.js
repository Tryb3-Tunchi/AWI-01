// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4OloCIRIiY1CNYiBDkkwx84Bt7O355Dw",
  authDomain: "my-medical-ba9bc.firebaseapp.com",
  projectId: "my-medical-ba9bc",
  storageBucket: "my-medical-ba9bc.firebasestorage.app",
  messagingSenderId: "217616461390",
  appId: "1:217616461390:web:54fc2ecd30eedc39939d1f",
  measurementId: "G-L2SJNDSJF3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Test Firestore connection
console.log("Firestore initialized:", db ? "Success" : "Failed");

// Test connection with timeout
setTimeout(() => {
  auth.onAuthStateChanged((user) => {
    console.log("Firebase Auth State:", user ? "User logged in" : "No user");
  });
}, 1000);

// Add offline detection
window.addEventListener("online", () => {
  console.log("Browser is online");
});

window.addEventListener("offline", () => {
  console.log("Browser is offline");
});

export default app;
