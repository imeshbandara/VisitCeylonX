import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventById } from '../api';
import { ArrowLeft, Calendar, MapPin, Sparkles, Clock } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const { data } = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Error loading event details:", err);
      } finally {
        setLoading(false);
      }
    };
    getEventData();
  }, [id]);

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!event) {
    return <div className="text-center py-20 text-xs font-bold text-slate-400">Festival record not found. <Link to="/" className="text-blue-600 block mt-2">Back Home</Link></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/40 pb-24 font-sans">
      
      {/* BANNER COVER CONTAINER */}
      <div className="relative h-[40vh] w-full bg-slate-900">
        <img src={event.image} alt={event.name} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="absolute top-8 left-8">
          <Link to="/" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
        <div className="absolute bottom-8 left-8 text-white">
          <span className="bg-amber-500/90 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded">Annual Celebration</span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-3">{event.name}</h1>
        </div>
      </div>

      {/* CORE SPECIFICATIONS GRID */}
      <div className="max-w-4xl mx-auto px-8 mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* TEXT LOGIC OVERVIEW */}
        <div className="md:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">About the Festival</h2>
          <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* TIME STAMP TAG METRICS BOX */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Schedule</h3>
          
          <div className="space-y-3 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Calendar size={14} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Holding Month</p>
                <p className="mt-0.5 font-bold text-slate-800">{event.month}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <MapPin size={14} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Main Venue Location</p>
                <p className="mt-0.5 font-bold text-slate-800">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetails;