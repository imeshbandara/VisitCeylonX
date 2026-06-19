import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

// 🛠️ REDUX SYSTEM INTEGRATION
import { useDispatch, useSelector } from 'react-redux';
import { authLoginSuccess, authError } from '../store/authSlice.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux states කියවා ගැනීම
  const { error: authGlobalError } = useSelector((state) => state.auth);

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setLocalError(null);
    dispatch(authError(null)); 
  };

  // 🚀 1. NATIVE FORM SUBMIT HANDLER (මෙන්න මේකයි මඟහැරිලා තිබුණේ)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match! Please re-verify.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp 
  ? 'http://localhost:5002/api/tourists/register'  //  Tourists API Register
  : 'http://localhost:5002/api/tourists/login';     //  Tourists API Login

      const { data } = await axios.post(endpoint, formData);

      dispatch(authLoginSuccess(data));
      alert(isSignUp ? "Account provisioned successfully! 🎉" : "Welcome back to VisitCeylonX! 👋");
      navigate('/');
    } catch (err) {
      console.error("Auth Engine Error:", err);
      const errMsg = err.response?.data?.message || "Authentication layer handshake failed.";
      dispatch(authError(errMsg));
    } finally {
      setLoading(false);
    }
  };

  // 🚀 2. REAL GOOGLE OAUTH LOGIN FUNCTION
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfoRes = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const googleUserData = userInfoRes.data;

        const authPayload = {
          result: {
            fullName: googleUserData.name,
            email: googleUserData.email,
            picture: googleUserData.picture,
            googleId: googleUserData.sub
          },
          token: tokenResponse.access_token
        };

        dispatch(authLoginSuccess(authPayload));
        alert("Authenticated via Google Engine successfully! 🌍🎉");
        navigate('/');
      } catch (error) {
        console.error("Google Authentication Fetch Error:", error);
        dispatch(authError("Failed to fetch user profile data from Google."));
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth Flow Crashed:", error);
      dispatch(authError("Google OAuth handshake was rejected."));
    }
  });

  return (
    <div className="min-h-screen bg-slate-50/40 flex items-center justify-center pt-24 pb-12 px-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-teal-500" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isSignUp ? "Join VisitCeylonX to access premium AI generation features." : "Sign in to access your custom AI Travel Planners."}
          </p>
        </div>

        {(localError || authGlobalError) && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 mb-5">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{localError || authGlobalError}</span>
          </div>
        )}

        {/* 🛠️ FORM USES THE CORRECT SUBMIT HANDLER */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                  <User size={16} className="text-slate-400" />
                  <input type="text" placeholder="Imesh Bandara"尊 required={isSignUp} value={formData.fullName} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" onChange={(e) => handleInputChange('fullName', e.target.value)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
              <Mail size={16} className="text-slate-400" />
              <input type="email" placeholder="imesh@domain.com" required value={formData.email} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" onChange={(e) => handleInputChange('email', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Secure Password</label>
            <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
              <Lock size={16} className="text-slate-400" />
              <input type="password" placeholder="••••••••" required value={formData.password} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" onChange={(e) => handleInputChange('password', e.target.value)} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                  <Lock size={16} className="text-slate-400" />
                  <input type="password" placeholder="••••••••" required={isSignUp} value={formData.confirmPassword} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" onChange={(e) => handleInputChange('confirmPassword', e.target.value)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 uppercase tracking-wider mt-2">
            {loading ? "Processing..." : <>{isSignUp ? "Register Account" : "Secure Sign In"} <ArrowRight size={14} /></>}
          </button>
        </form>

        <div className="text-center mt-5 text-[11px] font-bold text-slate-400">
          {isSignUp ? "Already registered?" : "New explorer?"}{" "}
          <button onClick={switchMode} className="text-blue-600 hover:text-blue-700 transition-colors outline-none font-black ml-0.5">
            {isSignUp ? "Sign In Instead" : "Create an Account"}
          </button>
        </div>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Or Connection Hub</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* 🌐 OPERATIONAL GOOGLE LOGIN */}
        <button type="button" onClick={() => loginWithGoogle()} className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.72 5.72 0 0 1 8.24 12.8a5.72 5.72 0 0 1 5.751-5.714c1.554 0 2.964.614 3.996 1.614l3.053-3.053A9.913 9.913 0 0 0 13.99 2.4C8.472 2.4 4 6.873 4 12.4s4.472 10 9.991 10c6.155 0 9.324-4.57 8.847-10.115H12.24z"/>
            <path fill="#4285F4" d="M22.838 12.285c0-.773-.065-1.545-.195-2.3H12.24v4.414h5.955c-.256 1.383-1.034 2.555-2.203 3.386v2.814h3.555c2.08-1.914 3.29-4.73 3.29-7.314z"/>
            <path fill="#FBBC05" d="M13.99 22.4c2.695 0 4.954-.89 6.607-2.414l-3.555-2.814c-.986.66-2.245 1.055-3.052 1.055-2.617 0-4.488-1.705-5.136-4.114H5.214v2.905A9.922 9.922 0 0 0 13.991 22.4z"/>
            <path fill="#34A853" d="M8.855 14.114A5.92 5.92 0 0 1 8.52 12.4c0-.59.105-1.164.295-1.714V7.78H5.214A9.925 9.925 0 0 0 4 12.4c0 1.69.426 3.286 1.214 4.62l3.64-2.906z"/>
          </svg>
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
};

export default Login;