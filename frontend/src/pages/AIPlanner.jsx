import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Send, Calendar, MapPin, DollarSign, Compass } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIPlanner = () => {
  const [formData, setFormData] = useState({
    destination: '', days: '', preferences: '', budget: 'Moderate'
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data } = await axios.post('http://localhost:5002/api/ai/generate-plan', formData);
        setResult(data.plan);
    } catch (error) {
        // Handle fallback message from our upgraded backend error handler
        if (error.response && error.response.status === 503) {
            alert(error.response.data.message);
        } else {
            alert("Something went wrong. Please check your connection.");
        }
    } finally {
        setFormData({ destination: '', days: '', preferences: '', budget: 'Moderate' }); // Clear form fields securely
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-teal-50 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-3"
          >
            <Sparkles size={16} className="text-accent" /> Next-Gen Travel planning
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Travel Itinerary Planner
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Let our intelligent engine curate a tailored Sri Lankan experience just for you.
          </p>
        </div>

        {/* Input Form Card */}
        <form onSubmit={handleGenerate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Destination</label>
              <input 
                type="text" placeholder="e.g. Ella, Kandy, Mirissa" required value={formData.destination}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Days)</label>
              <input 
                type="number" min="1" max="30" placeholder="Number of days" required value={formData.days}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                onChange={(e) => setFormData({...formData, days: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Budget Tier</label>
              <select 
                value={formData.budget}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-teal-100 outline-none transition-all bg-white"
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              >
                <option value="Budget">Budget Friendly</option>
                <option value="Moderate">Moderate / Standard</option>
                <option value="Luxury">Premium / Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Travel Preferences</label>
              <input 
                type="text" placeholder="e.g. Wildlife safari, Ancient temples, Surfing" value={formData.preferences}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-md hover:shadow-teal-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Compass className="animate-spin" size={18} /> Processing Adventure Parameters...
              </span>
            ) : (
              <><Send size={18} /> Generate Bespoke Plan</>
            )}
          </button>
        </form>

        {/* Beautiful Rendered Output Container */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-slate-100"
          >
            <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2 text-primary font-bold text-lg">
              <Calendar className="text-accent" /> Your Tailored Ceylon Exploration Itinerary
            </div>
            
            {/* Markdown Styled Wrapper */}
            <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h3:text-primary prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AIPlanner;