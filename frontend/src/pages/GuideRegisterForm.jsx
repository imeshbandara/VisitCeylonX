import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const GuideRegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    languages: '',
    contact: '',
    experience: '',
    profileImage: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert languages string to an array for the backend
      const langArray = formData.languages.split(',').map(l => l.trim());
      const dataToSend = { ...formData, languages: langArray };

      await axios.post('http://localhost:5002/api/guides/register', dataToSend);
      alert("Registration Successful!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-primary mb-6">Guide Application</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Full Name</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Languages (comma separated)</label>
            <input 
              type="text" placeholder="e.g. English, Sinhala, French"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
              onChange={(e) => setFormData({...formData, languages: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">Contact Number</label>
              <input 
                type="text" required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">Years of Experience</label>
              <input 
                type="number" required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-2">Profile Image URL</label>
            <input 
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary"
              onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors">
            Submit Registration
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default GuideRegisterForm;