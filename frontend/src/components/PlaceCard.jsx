import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { MapPin, ArrowRight } from 'lucide-react';

const PlaceCard = ({ place }) => {
  return (
    // මුළු කාඩ් එකම Link එකක් කරනවා අදාළ Place ID එකට යන්න
    <Link 
      to={`/place/${place._id}`} 
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-slate-200/80 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
          {place.category || 'Destination'}
        </span>
      </div>

      {/* Content Panel */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1.5">
            <MapPin size={12} className="text-blue-500" />
            <span>{place.location}</span>
          </div>
          <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors">
            {place.name}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>

        <div className="border-t border-slate-50 pt-4 mt-5 flex justify-between items-center text-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</p>
            <p className="font-bold text-slate-800 mt-0.5">LKR {place.cost} up</p>
          </div>
          <div className="w-8 h-8 bg-slate-50 border border-slate-100 group-hover:bg-blue-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-200">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;