// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // <<--- ADD Outlet
import { useAuth } from '../context/AuthContext';

// Props:
// - allowedRoles: An array of roles that are allowed to access this route (e.g., ['creator', 'admin'])
function ProtectedRoute({ allowedRoles }) { // <<--- ADD allowedRoles PROP
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading authentication state...</div>;
  }

  if (!currentUser) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for allowed roles IF allowedRoles prop is provided
  if (allowedRoles && allowedRoles.length > 0) {
    // Ensure currentUser.role exists before trying to check it
    if (!currentUser.role || !allowedRoles.includes(currentUser.role)) {
      // Logged in, but role is not in the allowedRoles array
      console.warn(
        `User with role '${currentUser.role || 'undefined'}' attempted to access a restricted route. Allowed roles: ${allowedRoles.join(', ')}`
      );
      // Redirect to homepage or an "Unauthorized" page
      return <Navigate to="/" replace />;
      // Example for an unauthorized page:
      // return <Navigate to="/unauthorized" replace />;
    }
  }

  // If we reach here, user is authenticated and (if roles specified) authorized
  return <Outlet />; // <<--- RENDER <Outlet /> to display the nested child route
}

export default ProtectedRoute;