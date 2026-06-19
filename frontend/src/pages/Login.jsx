import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

// 🛠️ REDUX SYSTEM INTEGRATION
import { useDispatch, useSelector } from 'react-redux';
import { authLoginSuccess, authError } from '../store/authSlice.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux error සහ loading states කියවා ගැනීම
  const { error: authGlobalError } = useSelector((state) => state.auth);

  // Form එක Toggle කිරීමට (Login Mode vs Sign Up Mode)
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Input States Matrix
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 🔄 Mode එක මාරු කරද්දී දත්ත සහ Errors ක්ලියර් කිරීම
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setLocalError(null);
    dispatch(authError(null)); // Clear global redux error
  };

  // 🚀 SUBMIT HANDLER (NATIVE CREDENTIALS VIA AXIOS & REDUX)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    // Sign Up පියවරේදී passwords ගැලපේදැයි බැලීම
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match! Please re-verify.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp 
        ? 'http://localhost:5002/api/users/signup' 
        : 'http://localhost:5002/api/users/signin';

      const { data } = await axios.post(endpoint, formData);

      // 🎯 SUCCESS: දත්ත Redux Store එකට සහ LocalStorage එකට ලොක් කිරීම
      dispatch(authLoginSuccess(data));
      alert(isSignUp ? "Account provisioned successfully! 🎉" : "Welcome back to VisitCeylonX Node! 👋");
      navigate('/');
    } catch (err) {
      console.error("Auth Engine Error:", err);
      const errMsg = err.response?.data?.message || "Authentication layer handshake failed.";
      dispatch(authError(errMsg)); // Redux error එක update කිරීම
    } finally {
      setLoading(false);
    }
  };

  // 🌐 GOOGLE SIGN-IN PLACEHOLDER FUNCTION (දැනට ඔයා Navbar එකේ පාවිච්චි කරන එකම මෙතනට දාන්න)
  const handleGoogleSignInClick = () => {
    alert("Triggering existing Google OAuth Instance...");
    // ඔයා Navbar එකේ ලියපු Google login function එක හෝ component එක මෙතනට direct කරන්න පුළුවන්
  };

  return (
    <div className="min-h-screen bg-slate-50/40 flex items-center justify-center pt-24 pb-12 px-6 font-sans">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1400')] bg-cover bg-center opacity-[0.02] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-teal-500" />

        {/* HEADER SECTION */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isSignUp 
              ? "Join VisitCeylonX to access premium AI generation features." 
              : "Sign in to access your custom AI Travel Planners."
            }
          </p>
        </div>

        {/* ERROR ADVISORY MATRIX */}
        {(localError || authGlobalError) && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 mb-5">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{localError || authGlobalError}</span>
          </div>
        )}

        {/* NATIVE AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                  <User size={16} className="text-slate-400" />
                  <input 
                    type="text" placeholder="Imesh Bandara" required={isSignUp} value={formData.fullName}
                    className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700 placeholder-slate-400/80"
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
              <Mail size={16} className="text-slate-400" />
              <input 
                type="email" placeholder="imesh@domain.com" required value={formData.email}
                className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700 placeholder-slate-400/80"
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Secure Password</label>
            <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
              <Lock size={16} className="text-slate-400" />
              <input 
                type="password" placeholder="••••••••" required value={formData.password}
                className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700 placeholder-slate-400/80"
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                  <Lock size={16} className="text-slate-400" />
                  <input 
                    type="password" placeholder="••••••••" required={isSignUp} value={formData.confirmPassword}
                    className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700 placeholder-slate-400/80"
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT CALL-TO-ACTION BUTTON */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 uppercase tracking-wider mt-2"
          >
            {loading ? "Processing Credentials Matrix..." : (
              <>{isSignUp ? "Register Account" : "Secure Sign In"} <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        {/* TOGGLE OPTION BETWEEN SIGN UP / SIGN IN */}
        <div className="text-center mt-5 text-[11px] font-bold text-slate-400">
          {isSignUp ? "Already registered into our hub?" : "New explorer in Sri Lanka?"}{" "}
          <button onClick={switchMode} className="text-blue-600 hover:text-blue-700 transition-colors outline-none font-black ml-0.5">
            {isSignUp ? "Sign In Instead" : "Create an Account"}
          </button>
        </div>

        {/* SEPARATOR MATRIX LINE */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Or Connection Hub</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* EXISTING GOOGLE AUTH BUTTON ACCENT */}
        <button 
          onClick={handleGoogleSignInClick}
          className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {/* Custom Beautiful Google SVG Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.72 5.72 0 0 1 8.24 12.8a5.72 5.72 0 0 1 5.751-5.714c1.554 0 2.964.614 3.996 1.614l3.053-3.053A9.913 9.913 0 0 0 13.99 2.4C8.472 2.4 4 6.873 4 12.4s4.472 10 9.991 10c6.155 0 9.324-4.57 8.847-10.115H12.24z"/>
            <path fill="#4285F4" d="M22.838 12.285c0-.773-.065-1.545-.195-2.3H12.24v4.414h5.955c-.256 1.383-1.034 2.555-2.203 3.386v2.814h3.555c2.08-1.914 3.29-4.73 3.29-7.314z"/>
            <path fill="#FBBC05" d="M13.99 22.4c2.695 0 4.954-.89 6.607-2.414l-3.555-2.814c-.986.66-2.245 1.055-3.052 1.055-2.617 0-4.488-1.705-5.136-4.114H5.214v2.905A9.922 9.922 0 0 0 13.991 22.4z"/>
            <path fill="#34A853" d="M8.855 14.114A5.92 5.92 0 0 1 8.52 12.4c0-.59.105-1.164.295-1.714V7.78H5.214A9.925 9.925 0 0 0 4 12.4c0 1.69.426 3.286 1.214 4.62l3.64-2.906z"/>
          </svg>
          Google සමගින් පුරන්න
        </button>

      </motion.div>
    </div>
  );
};

export default Login;