import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';

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
        alert("Error generating plan");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Sparkles className="text-accent" /> AI Travel Planner
        </h1>
        <p className="text-textSecondary mt-2">Let our AI create your perfect Sri Lankan journey.</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
            type="text" placeholder="Where to? (e.g. Ella, Kandy)" required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
          />
          <input 
            type="number" placeholder="How many days?" required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
            onChange={(e) => setFormData({...formData, days: e.target.value})}
          />
        </div>
        <textarea 
          placeholder="What do you like? (e.g. Hiking, Beaches, Temples)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none h-32"
          onChange={(e) => setFormData({...formData, preferences: e.target.value})}
        ></textarea>
        <button 
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Generating Magic..." : <><Send size={18} /> Generate Plan</>}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-md border-l-4 border-primary whitespace-pre-wrap text-textPrimary leading-relaxed"
        >
          {result}
        </motion.div>
      )}
    </div>
  );
};

export default AIPlanner;