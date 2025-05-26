// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, db } from '../firebase'; // <<--- 1. IMPORT db FROM FIREBASE
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // <<--- 2. IMPORT FIRESTORE FUNCTIONS

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // MODIFIED signup function to include Firestore write
async function signup(email, password, displayName = '') {
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create a document reference in Firestore for this new user
      const userDocRef = doc(db, "users", user.uid); // Path: /users/{the_user's_unique_ID}

      // 3. Prepare the data to store in the Firestore document
      const userData = {
        uid: user.uid, // Storing the UID again for convenience
        email: user.email, // Storing the email
        displayName: displayName.trim() || email.split('@')[0], // Use provided displayName or a default
        role: 'viewer', // Assign a default role
        createdAt: serverTimestamp(), // Get a server-generated timestamp
      };

      // 4. Write the data to Firestore
      await setDoc(userDocRef, userData); // This is the 'setDoc logic'

      // 5. Return the authentication user credential
      return userCredential;
    } catch (error) {
      console.error("Error during signup (AuthContext):", error.message);
      console.error("Full error object (AuthContext):", error);
      throw error; // Re-throw so LoginPage can catch it
    }
  }

  // Wrapper for Firebase login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Wrapper for Firebase logout
  function logout() {
    return signOut(auth);
  }

  // Effect to listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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