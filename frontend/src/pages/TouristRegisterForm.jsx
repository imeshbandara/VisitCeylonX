import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Globe } from 'lucide-react';

const TouristRegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    country: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Using the backend port 5002 as seen in your logs
      await axios.post('http://localhost:5002/api/tourists/register', formData);
      alert("Welcome to Sri Lanka! Registration Successful.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Create Account</h2>
          <p className="text-textSecondary text-sm mt-2">Start your journey with VisitCeylonX</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-secondary" size={20} />
            <input 
              type="text" placeholder="Full Name" required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary transition-all"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-secondary" size={20} />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-secondary" size={20} />
            <input 
              type="password" placeholder="Password" required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Country */}
          <div className="relative">
            <Globe className="absolute left-4 top-3.5 text-secondary" size={20} />
            <input 
              type="text" placeholder="Your Country" required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary transition-all"
              onChange={(e) => setFormData({...formData, country: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-md active:scale-95">
            Create Tourist Account
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TouristRegisterForm;