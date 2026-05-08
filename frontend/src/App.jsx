import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      <HomePage />
      {/* passe methaat footer ekak ekathu kranna puluwn */}
    </div>
  );
}

export default App;