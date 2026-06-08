import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PlaceDetails from './pages/PlaceDetails';
import GuidePage from './pages/GuidePage';
import RegisterSelect from './pages/RegisterSelect';
import GuideRegisterForm from './pages/GuideRegisterForm';
import TouristRegisterForm from './pages/TouristRegisterForm';
import AIPlanner from './pages/AIPlanner';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AllPlaces from './pages/AllPlaces';
import EventDetails from './pages/EventDetails';
import WeatherGuide from './pages/WeatherGuide.jsx';


function App() {

  const initialOptions = {
    "client-id": "AR5_8Q9k3Vd9Ex4l3Nl9n8TFjnoqD8M0NUShw1aeg0HcQ_vqMLXzs67S2CXI0FGadlpnnBH_zXaMvwb5",
    currency: "USD",
    intent: "capture",
  };
  
  return (
    <GoogleOAuthProvider clientId="783474425979-spp44uorg59kbpfl5tenakcln2ksclp2.apps.googleusercontent.com">
    <PayPalScriptProvider options={initialOptions}>
    <Router>
      <div className="min-h-screen font-poppins bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/guides" element={<GuidePage />} />
          <Route path="/register" element={<RegisterSelect />} />
          <Route path="/register/guide" element={<GuideRegisterForm />} />
          <Route path="/register/tourist" element={<TouristRegisterForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/all-places" element={<AllPlaces />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/weather-guide" element={<WeatherGuide />} />
          <Route 
              path="/planner" 
              element={
                <ProtectedRoute>
                  <AIPlanner />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
          </div>
         </Router>
    </PayPalScriptProvider>
    </GoogleOAuthProvider>
  );
}

export default App;