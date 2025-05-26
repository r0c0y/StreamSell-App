// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'; // <<--- IMPORT getDoc

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName = '') {
    // ... (your existing signup function with Firestore write - looks good on GitHub)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName.trim() || email.split('@')[0],
        role: 'viewer',
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, userData);
      // No need to set currentUser here, onAuthStateChanged will handle it
      return userCredential;
    } catch (error) {
      console.error("Error during signup (AuthContext):", error.message, error);
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  // MODIFIED useEffect to fetch Firestore user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // <<--- Make callback async
      if (user) {
        // User is signed in, fetch their Firestore document
        const userDocRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // Merge Firebase Auth user data with Firestore data
            setCurrentUser({
              ...user, // Spread Firebase Auth user properties (uid, email, etc.)
              ...docSnap.data() // Spread Firestore document data (displayName, role, etc.)
            });
          } else {
            // This case should ideally not happen if signup always creates a Firestore doc
            console.warn("No such user document in Firestore for UID:", user.uid);
            setCurrentUser(user); // Fallback to just the Auth user object
          }
        } catch (error) {
          console.error("Error fetching user document from Firestore:", error);
          setCurrentUser(user); // Fallback in case of error
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription
  }, []); // Empty dependency array

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