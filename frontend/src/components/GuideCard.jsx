import React from 'react';
import { Star, Languages, Phone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GuideCard = ({ guide }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4 mb-6">
        {/* Profile Image */}
        <div className="relative">
          <img 
            src={guide.profileImage || 'https://via.placeholder.com/150'} 
            className="w-20 h-20 rounded-full object-cover border-2 border-secondary"
            alt={guide.fullName}
          />
          {guide.isAvailable && (
            <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-white" />
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-textPrimary">{guide.fullName}</h3>
          <div className="flex items-center gap-1 text-accent">
            <Star size={16} fill="currentColor" />
            <span className="font-semibold text-sm">{guide.rating}</span>
            <span className="text-textSecondary font-normal text-xs">(Verified Guide)</span>
          </div>
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-textSecondary text-sm">
          <Languages size={16} className="text-primary" />
          <span>Speaks: {guide.languages.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-textSecondary text-sm">
          <CheckCircle size={16} className="text-primary" />
          <span>{guide.experience} Years Experience</span>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl hover:bg-teal-700 transition-colors font-medium">
        <Phone size={18} />
        Contact Guide
      </button>
    </motion.div>
  );
};

export default GuideCard;