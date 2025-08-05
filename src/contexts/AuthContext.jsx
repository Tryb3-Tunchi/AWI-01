import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Sign up function for admin users
  const signUp = async (email, password, displayName, role = "admin") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Get user role from Firestore
  const getUserRole = async (uid) => {
    try {
      // Check if Firestore is available
      if (!db) {
        console.warn("Firestore not initialized");
        return "admin"; // Default for testing
      }

      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error("Error getting user role:", error);
      // Return admin role for testing purposes
      return "admin";
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Auth timeout - proceeding without Firebase");
      setLoading(false);
    }, 5000); // 5 second timeout

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeoutId); // Clear timeout if auth succeeds
      setCurrentUser(user);

      if (user) {
        // Only try to get user role if we have a valid user
        if (user.uid) {
          try {
            const role = await getUserRole(user.uid);
            setUserRole(role);
          } catch (error) {
            console.error("Error getting user role:", error);
            // Don't set role to null on error, keep previous value
            if (!userRole) {
              setUserRole("admin"); // Default to admin for testing
            }
          }
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [userRole]);

  const value = {
    currentUser,
    userRole,
    signUp,
    signIn,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
