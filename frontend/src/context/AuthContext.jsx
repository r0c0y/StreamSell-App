// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase'; // Ensure this path is correct to your firebase.js or firebase.jsx

// 1. Create the Auth Context
const AuthContext = createContext();

// 2. Custom hook to easily use the Auth Context
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

// 3. AuthProvider component that will wrap our application
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To manage initial auth state check

  // Wrapper for Firebase signup
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
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
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set user to null if logged out, or user object if logged in
      setLoading(false);    // Auth state has been determined, no longer loading
    });

    // Cleanup: Unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  // The value object that will be provided to consuming components
  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading // Expose loading state so components can react if needed
  };

  // Render the AuthContext.Provider with the value
  // Only render children once the initial loading (auth state check) is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}