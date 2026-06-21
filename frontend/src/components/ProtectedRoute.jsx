import React from 'react';
import { Navigate } from 'react-router-dom';

// 🛠️ REDUX CORE IMPORTS එකතු කරන්න
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // 🎯 Redux Global Store එකෙන් පරිශීලකයා ඉන්නවාදැයි සැබෑ ලෙස චෙක් කිරීම
  const { authData } = useSelector((state) => state.auth);
  
  // Google Auth හෝ Custom Token එකක් හරහා user කෙනෙක් සිටීදැයි බැලීම
  const user = authData?.user || authData?.result || authData || localStorage.getItem("user");

  if (!user) {
    // පරිශීලකයා ලොග් වී නැත්නම් ඇලර්ට් එකක් දී ලොගින් පේජ් එකට හරවා යැවීම
    alert("Please sign in first to unlock your AI Travel Planner! 🔒");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;