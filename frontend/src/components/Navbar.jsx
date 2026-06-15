import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';

// 🛠️ REDUX CORE IMPORTS
import { useSelector, useDispatch } from 'react-redux';
import { authLoginSuccess, authLogout } from '../store/authSlice.js';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch();

  // 🎯 Redux Global Store එකෙන් කෙලින්ම user දත්ත ලබා ගැනීම
  const { authData } = useSelector((state) => state.auth);
  
  // Google login හෝ Custom JWT login ව්‍යුහයන් දෙකටම ගැලපෙන සේ user වෙන් කර ගැනීම
  const user = authData?.user || authData?.result || authData;

  // Monitors session changes securely across route interactions
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    // යම් හෙයකින් LocalStorage එකේ දත්ත තිබී රෙඩක්ස් එක හිස්ව තිබුනොත් එය auto-sync කරයි
    if (loggedUser && !authData) {
      dispatch(authLoginSuccess({
        user: JSON.parse(loggedUser),
        token: token
      }));
    }
  }, [location.pathname, dispatch, authData]);

  const handleLogout = () => {
    // 🚀 Redux Logout Action එක trigger කිරීම (LocalStorage එකත් එහිදී ක්ලියර් වේ)
    dispatch(authLogout());
    
    // ඔයාගේ පැරණි පද්ධතියේ තිබූ සාමාන්‍ය LocalStorage keys ද අතිරේක ආරක්ෂාවට මකා දැමීම
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out successfully! See you again. 👋");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // --- 🔒 නම split කිරීමේදී සිදුවන ක්‍රෑෂ් වැළැක්වීමේ ආරක්ෂිත ආරක්ෂණ පවුර ---
  const rawName = user?.fullName || user?.name || user?.displayName || "";
  const nameArray = rawName ? rawName.split(' ') : [];
  const firstName = nameArray.length > 0 ? nameArray[0] : "Traveler";

  return (
    // Outer dynamic container with clean alignment layouts
    <div className="fixed top-0 left-0 w-full z-50 px-6 pt-4 pointer-events-none">
      <nav className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl h-16 px-6 flex justify-between items-center pointer-events-auto transition-all duration-300">
        
        {/* BRAND LOGO DESIGN */}
        <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm shadow-blue-600/20">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-800">
            VisitCeylon<span className="text-blue-600">X</span>
          </span>
        </Link>

        {/* RECTILINEAR LINK CONFIGURATIONS */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
          <Link 
            to="/" 
            className={`transition-colors duration-150 ${
              isActive('/') ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/guides" 
            className={`transition-colors duration-150 ${
              isActive('/guides') ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find Guide
          </Link>
          <Link 
            to="/planner" 
            className={`transition-colors duration-150 ${
              isActive('/planner') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            AI Planner
          </Link>
          <Link 
            to="/weather-guide" 
            className={`text-xs font-bold transition-colors duration-150 relative ${
              isActive('/weather-guide') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Weather Guide
            <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </Link>
        </div>

        {/* AUTHENTICATED USER CONSOLE LOGIC */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 pl-2 pr-3 py-1 rounded-xl">
              <div className="flex items-center gap-2">
                {user.picture || user.imageUrl ? (
                  <img 
                    src={user.picture || user.imageUrl} 
                    alt={firstName} 
                    className="w-6 h-6 rounded-lg object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[10px] font-bold uppercase">
                    {firstName[0]}
                  </div>
                )}
                <span className="text-slate-700 font-semibold max-w-[80px] truncate">
                  {firstName}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-600 transition-colors border-l pl-2 border-slate-200"
                title="Sign Out"
              >
                <LogOut size={14} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            /* STRIPE-STYLE LOGIN REGISTER CTA SPLIT */
            <div className="flex items-center gap-5">
              <Link to="/login" className="font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-600/10 transition-all duration-150"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;