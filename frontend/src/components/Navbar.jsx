import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-2xl text-primary">
          <MapPin size={28} />
          <span>VisitCeylonX</span>
        </div>

        {/* Desktop Menu */}
       <div className="hidden md:flex gap-8 items-center text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/" className="hover:text-primary transition-colors">Explore</Link>
          <Link to="/guides" className="hover:text-primary transition-colors">Find Guide</Link>
        
          <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-transform duration-200">
            Register
          </Link>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-transform duration-200">
            AI Planner
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
