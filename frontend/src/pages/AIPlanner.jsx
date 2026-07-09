import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Calendar, Compass, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// 🛠️ REDUX CORE INTEGRATION IMPORTS
import { useSelector, useDispatch } from 'react-redux';
import { updatePlannerFormField, generateAIItinerary } from '../store/plannerSlice.js';

// 📝 Text Extraction Utility for Custom Markdown Renderer
const extractText = (children) => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && children.props && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

const customRenderers = {
  h2: ({ node, ...props }) => {
    const text = extractText(props.children);
    if (text.match(/Day \d+/i)) {
      return (
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-md my-8 flex items-center gap-3">
          <Calendar className="text-indigo-100" size={24} />
          <h2 className="text-xl font-bold m-0" {...props} />
        </div>
      );
    }
    return <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-800" {...props} />;
  },
};

const AIPlanner = () => {
  const dispatch = useDispatch();

  // 🎯 Redux Global Store එකෙන් ප්ලෑනර් දත්ත සියල්ල කියවා ගැනීම
  const { 
    formData, 
    generatedPlan: result, 
    loading, 
    error 
  } = useSelector((state) => state.planner);

  // Input Fields වෙනස් වන විට Redux State එක update කරන Handler එක
  const handleInputChange = (field, value) => {
    dispatch(updatePlannerFormField({ [field]: value }));
  };

  // AI Itinerary එක ජෙනරේට් කිරීමට Form එක Submit වන විට ක්‍රියාත්මක වන Function එක
  const handleGenerate = async (e) => {
    e.preventDefault();

    // 🚀 Redux Async Thunk එක හරහා දත්ත අපේ සර්වර් එකට යැවීම
    // (plannerSlice එක ඇතුලේ අපි හදපු දත්ත keys ටික ඔයාගේ පැරණි backend එකට ගැළපෙන සේ මෙහිදී map කර යවයි)
    const payload = {
      destination: formData.destination || formData.destinations?.[0] || '',
      days: formData.days || formData.durationDays || '',
      budget: formData.budget || formData.budgetType || 'Moderate',
      preferences: formData.preferences || formData.interests?.join(', ') || ''
    };

    dispatch(generateAIItinerary(payload));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-3 border border-teal-100"
          >
            <Sparkles size={16} className="text-amber-500 fill-amber-500/20" /> Next-Gen Travel Planning
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            AI Travel Itinerary Planner
          </h1>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Let our intelligent engine curate a tailored Sri Lankan experience just for you.
          </p>
        </div>

        {/* Global Error Banner Display */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold p-4 rounded-xl text-center mb-6 flex items-center justify-center gap-2">
            <AlertTriangle size={14} /> ⚠️ {error}
          </div>
        )}

        {/* Input Form Card */}
        <form onSubmit={handleGenerate} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Destination</label>
              <input 
                type="text" 
                placeholder="e.g. Ella, Kandy, Mirissa" 
                required 
                value={formData.destination || ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all font-medium text-slate-800 text-sm"
                onChange={(e) => handleInputChange('destination', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Days)</label>
              <input 
                type="number" 
                min="1" 
                max="30" 
                placeholder="Number of days" 
                required 
                value={formData.days || ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all font-medium text-slate-800 text-sm"
                onChange={(e) => handleInputChange('days', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Budget Tier</label>
              <select 
                value={formData.budget || 'Moderate'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all bg-white font-medium text-slate-800 text-sm"
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <option value="Budget">Budget Friendly</option>
                <option value="Moderate">Moderate / Standard</option>
                <option value="Luxury">Premium / Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Travel Preferences</label>
              <input 
                type="text" 
                placeholder="e.g. Wildlife safari, Ancient temples, Surfing" 
                value={formData.preferences || ''}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all font-medium text-slate-800 text-sm"
                onChange={(e) => handleInputChange('preferences', e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-teal-600 text-white py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Compass className="animate-spin text-teal-400" size={18} /> Processing Adventure Parameters...
              </span>
            ) : (
              <><Send size={14} /> Generate Bespoke Plan</>
            )}
          </button>
        </form>

        {/* Beautiful Rendered Output Container */}
        {/* Beautiful Rendered Output Container */}
<AnimatePresence>
  {result && (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100"
    >
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
        <Calendar className="text-teal-600" size={20} /> Your Tailored Ceylon Exploration Itinerary
      </div>
      
      {/* Markdown Styled Wrapper */}
      <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h3:text-teal-600 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800 text-sm leading-relaxed">
        {/* 🧠 105% Safe Extraction Logic */}
        <ReactMarkdown components={customRenderers}>
          {result?.plan || result?.itinerary || (typeof result === 'string' ? result : '')}
        </ReactMarkdown>
      </div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  );
};

export default AIPlanner;