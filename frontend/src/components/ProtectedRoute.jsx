import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  
  // token ekak naththn login page ekat harawala yawanaw
  if (!token) {
    alert("Please sign in first to unlock your AI Travel Planner! 🔒");
    return <Navigate to="/login" replace />;
  }

  
  // token ekak thiynw nam adala component eka pennanw
  return children;
};

export default ProtectedRoute;