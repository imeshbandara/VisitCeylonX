import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaceCard = ({ place }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={place.imageUrl || 'https://via.placeholder.com/400x300'} 
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-primary uppercase tracking-wider">
          {place.category}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-6">
        <div className="flex items-center gap-1 text-textSecondary text-sm mb-2">
          <MapPin size={14} className="text-secondary" />
          <span>{place.district}, Sri Lanka</span>
        </div>
        
        <h3 className="text-xl font-bold text-textPrimary mb-3">{place.name}</h3>
        
        <p className="text-textSecondary text-sm line-clamp-2 mb-6 leading-relaxed">
          {place.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-textSecondary font-bold">Estimated Cost</span>
            <span className="text-primary font-bold">LKR {place.estimatedCosts?.transport} up</span>
          </div>
          
          <button className="p-3 bg-slate-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceCard;