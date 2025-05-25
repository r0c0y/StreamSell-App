// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation(); // To remember where the user was trying to go

  if (loading) {
    // While Firebase is checking auth state, show a loading indicator or nothing
    // This prevents a flash of the login page before auth state is confirmed
    return <div>Loading authentication state...</div>; // Or a spinner component
  }

  if (!currentUser) {
    // User not logged in, redirect them to the /login page
    // Pass the current location in state so we can redirect them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the children components (the protected page)
  return children;
}

export default ProtectedRoute;