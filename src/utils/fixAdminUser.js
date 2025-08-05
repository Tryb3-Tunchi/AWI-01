// Utility script to fix admin user role
// Run this in your browser console after logging in with your Firebase user

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Function to make current user an admin
export const makeCurrentUserAdmin = async () => {
  try {
    // Get current user from Firebase Auth
    const user = auth.currentUser;

    if (!user) {
      console.error("No user logged in");
      return;
    }

    // Create admin user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Admin User",
      role: "admin",
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    console.log("✅ User successfully made admin!");
    console.log("User ID:", user.uid);
    console.log("Email:", user.email);

    // Refresh the page to update the auth context
    window.location.reload();
  } catch (error) {
    console.error("❌ Error making user admin:", error);
  }
};

// Instructions for use:
// 1. Log in with your Firebase user at /admin/login
// 2. Open browser console (F12)
// 3. Copy and paste this function
// 4. Call: makeCurrentUserAdmin()
// 5. The page will refresh and you'll have admin access
