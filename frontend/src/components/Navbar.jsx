import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  
  // page eka load weddi saha wenas weddi localStorage eke user innawada kiyala balima
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    } else {
      setUser(null);
    }
  }, [window.location.pathname]); // Listen to route changes to update state immediately

 
  //layout wimedi localStorage eka his kara home pge ekat yawima
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    alert("Logged out successfully! See you again. 👋");
    navigate("/");
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <MapPin size={28} />
          <span>VisitCeylonX</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/guides" className="hover:text-primary transition-colors">Find Guide</Link>
          <Link to="/planner" className="text-primary font-semibold hover:text-teal-700 transition-colors flex items-center gap-1">
            ✨ AI Planner
          </Link>
          
          {/* Dynamic Render Logic (Conditional Rendering) */}
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
              {/* User Profile Image & Name */}
              <div className="flex items-center gap-2">
                <img 
                  src={user.picture} 
                  alt={user.fullName} 
                  className="w-8 h-8 rounded-full border border-primary object-cover"
                  referrerPolicy="no-referrer" // Prevent Google from blocking image load
                />
                <span className="text-slate-700 font-semibold max-w-[100px] truncate">
                  {user.fullName.split(' ')[0]} {/* Show only first name */}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            /* If not logged in, show Register Button */
            <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-transform duration-200">
              Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;