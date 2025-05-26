// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, db } from '../firebase'; // Ensure 'db' is correctly imported from your firebase setup
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'; // Added onSnapshot

// 1. Create the Auth Context
const AuthContext = createContext();

// 2. Custom hook to easily use the Auth Context
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

// 3. AuthProvider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signup function: Creates user in Auth and then their profile in Firestore
  async function signup(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a document in Firestore for this new user
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName.trim() || email.split('@')[0],
        role: 'viewer', // Default role
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, userData);
      // onAuthStateChanged will handle setting currentUser with combined data
      return userCredential;
    } catch (error) {
      console.error("Error during signup (AuthContext):", error.message, error);
      throw error;
    }
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting currentUser with combined data
  }

  // Logout function
  function logout() {
    return signOut(auth);
    // onAuthStateChanged will set currentUser to null
  }

  // Effect to listen for Firebase auth state changes AND Firestore user document changes
  useEffect(() => {
    let userDocumentListenerUnsubscribe = null; // To store Firestore onSnapshot unsubscribe function

    const authStateUnsubscribe = onAuthStateChanged(auth, (user) => { // 'user' here is the Firebase Auth user object
      // If there was a previous Firestore listener, unsubscribe from it
      if (userDocumentListenerUnsubscribe) {
        userDocumentListenerUnsubscribe();
        userDocumentListenerUnsubscribe = null;
      }

      if (user) {
        // User is signed in (Firebase Auth user object exists)
        const userDocRef = doc(db, "users", user.uid);

        // Set up a real-time listener for the user's document in Firestore
        userDocumentListenerUnsubscribe = onSnapshot(
          userDocRef,
          (docSnap) => { // This callback fires when the document is first read or changes
            if (docSnap.exists()) {
              // Document exists in Firestore, merge Auth user with Firestore data
              setCurrentUser({
                ...user,             // Core Firebase Auth properties (uid, email, etc.)
                ...docSnap.data()    // Custom Firestore data (displayName, role, createdAt, etc.)
              });
            } else {
              // Document does NOT exist in Firestore for this authenticated user.
              // This could happen if a user was created in Auth but the Firestore doc creation failed,
              // or if the doc was manually deleted.
              console.warn(`Firestore document for user ${user.uid} not found. Using Auth data with default role.`);
              // Provide a currentUser object with Auth data and a default 'viewer' role.
              // You might want to automatically create the Firestore document here if that's desired.
              setCurrentUser({
                ...user,
                displayName: user.displayName || user.email.split('@')[0], // Use Auth displayName or derive
                role: 'viewer', // Assign a default client-side role
                // Note: createdAt would be missing unless you create the doc here
              });
              // Example: To create the missing doc automatically (consider implications):
              // const defaultUserData = { /* ... same as in signup ... */ };
              // setDoc(userDocRef, defaultUserData)
              //  .then(() => console.log("Created missing Firestore doc for user:", user.uid))
              //  .catch(err => console.error("Error auto-creating Firestore doc:", err));
            }
            setLoading(false); // Auth and Firestore data (or lack thereof) processed
          },
          (error) => { // Error callback for onSnapshot
            console.error("Error listening to user document in Firestore:", error);
            // Fallback to just using the Firebase Auth user object if Firestore listener fails
            setCurrentUser(user);
            setLoading(false);
          }
        );
      } else {
        // User is signed out (Firebase Auth user object is null)
        setCurrentUser(null);
        setLoading(false);
      }
    });

    // Cleanup function for the useEffect hook
    // This will run when the AuthProvider component unmounts
    return () => {
      authStateUnsubscribe(); // Unsubscribe from Firebase Auth listener
      if (userDocumentListenerUnsubscribe) {
        userDocumentListenerUnsubscribe(); // Unsubscribe from Firestore listener if it exists
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // The value object provided to consuming components
  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}