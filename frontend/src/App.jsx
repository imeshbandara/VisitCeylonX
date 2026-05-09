import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-poppins bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guides" element={<GuidePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;