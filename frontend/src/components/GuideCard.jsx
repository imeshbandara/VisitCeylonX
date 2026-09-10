import React, { useState } from 'react';
import { Star, Languages, Phone, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const GuideCard = ({ guide }) => {
  const [imgError, setImgError] = useState(false);

  // Generate initials for avatar fallback (e.g., "Imesh Bandara" -> "IB")
  const getInitials = (name) => {
    if (!name) return 'VG';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'VG';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const hasValidImage = guide.profileImage && !imgError && guide.profileImage !== 'https://via.placeholder.com/150';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-4 mb-5">
        {/* Profile Image / Initials Avatar */}
        <div className="relative flex-shrink-0">
          {hasValidImage ? (
            <img 
              src={guide.profileImage} 
              className="w-20 h-20 rounded-full object-cover border-2 border-secondary shadow-sm"
              alt={guide.fullName}
              onError={() => setImgError(true)}
            />
          ) : (
            <div 
              className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-secondary flex items-center justify-center text-primary font-bold text-xl select-none shadow-inner tracking-wider"
              aria-label={guide.fullName}
            >
              {getInitials(guide.fullName)}
            </div>
          )}
          {guide.isAvailable && (
            <div 
              className="absolute bottom-0 right-0 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white ring-2 ring-emerald-100" 
              title="Available"
            />
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-800 truncate" title={guide.fullName}>
            {guide.fullName}
          </h3>
          <div className="flex items-center gap-1.5 text-accent mt-0.5">
            <Star size={15} fill="currentColor" />
            <span className="font-semibold text-sm">{guide.rating || 5.0}</span>
            <span className="text-slate-500 font-normal text-xs flex items-center gap-1">
              <ShieldCheck size={13} className="text-secondary inline" /> (Verified Guide)
            </span>
          </div>
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="space-y-2.5 mb-5 flex-grow">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <Languages size={16} className="text-primary flex-shrink-0" />
          <span className="truncate">
            Speaks: {Array.isArray(guide.languages) ? guide.languages.join(', ') : (guide.languages || 'English')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <CheckCircle size={16} className="text-primary flex-shrink-0" />
          <span>{guide.experience || 1} Years Experience</span>
        </div>
      </div>

      {/* Contact button */}
      <button 
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition-colors font-medium text-sm mb-1"
        onClick={() => {
          if (guide.contact) {
            window.location.href = `tel:${guide.contact}`;
          }
        }}
      >
        <Phone size={15} />
        <span>Contact Guide</span>
      </button>
    </motion.div>
  );
};

export default GuideCard;