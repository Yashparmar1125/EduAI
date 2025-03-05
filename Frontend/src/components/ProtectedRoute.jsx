import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ProtectedRoute component that checks the authentication status
const ProtectedRoute = ({ element }) => {
  const { status } = useSelector((state) => state.auth); // Accessing authentication status from Redux

  // If the user is not authenticated, redirect to the login page
  if (!status) {
    return <Navigate to="/login" />;
  }

  return element; // Render the protected element if the user is authenticated
};

export default ProtectedRoute;
