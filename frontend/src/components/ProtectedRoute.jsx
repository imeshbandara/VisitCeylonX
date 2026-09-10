import React from 'react';
import { Navigate } from 'react-router-dom';

// 🛠️ REDUX CORE IMPORTS ekathu kirima
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // 🎯 Redux Global Store eken user innawal kiyala hariyatm check kirima
  const { authData } = useSelector((state) => state.auth);
  
  // Google Auth or Custom Token ekak haraha user kenek innw kiyala balanaw
  const user = authData?.user || authData?.result || authData || localStorage.getItem("user");

  if (!user) {
    // user log wel nththn alert ekak denw frontend eka harha 
    alert("Please sign in first to unlock your AI Travel Planner! 🔒");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;