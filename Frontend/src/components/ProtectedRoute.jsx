import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ProtectedRoute component that checks the authentication status
const ProtectedRoute = ({ element }) => {
  const auth = useSelector((state) => state.auth);
  
  // Add loading state check
  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6938EF]"></div>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated = auth.status && auth.userData && auth.userData.email;
  
  if (!isAuthenticated) {
    console.log('Auth state:', auth); // Debug log
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
