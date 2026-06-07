import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div className="w-[300px] md:w-[340px] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 shrink-0 flex flex-col h-[400px]">
      
      {/* Photo Grid Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
        <img 
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[10px] font-bold text-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Calendar size={10} /> {event.month}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1">
            <MapPin size={12} className="text-blue-500" />
            <span>{event.location}</span>
          </div>
          <h3 className="font-extrabold text-base text-slate-800 tracking-tight line-clamp-1">
            {event.name}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* More Details Action Button */}
        <Link 
          to={`/event/${event._id}`}
          className="w-full bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 border border-slate-100 group mt-4 active:scale-[0.98]"
        >
          More Details
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
};

export default EventCard;