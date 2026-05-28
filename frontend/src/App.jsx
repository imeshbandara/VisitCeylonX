import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import RegisterSelect from './pages/RegisterSelect';
import GuideRegisterForm from './pages/GuideRegisterForm';
import TouristRegisterForm from './pages/TouristRegisterForm';
import AIPlanner from './pages/AIPlanner';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-poppins bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guides" element={<GuidePage />} />
          <Route path="/register" element={<RegisterSelect />} />
          <Route path="/register/guide" element={<GuideRegisterForm />} />
          <Route path="/register/tourist" element={<TouristRegisterForm />} />
          <Route path="/planner" element={<AIPlanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;