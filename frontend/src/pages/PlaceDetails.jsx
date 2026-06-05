import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPlaceById } from '../api';
import { MapPin, ArrowLeft, Shield, Compass, Clock, Wallet, Info } from 'lucide-react';

const PlaceDetails = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getPlaceData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetchPlaceById(id);
        const actualData = response?.data?.data || response?.data || response;
        
        if (actualData && (actualData._id || actualData.name)) {
          setPlace(actualData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Database connection dropped:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getPlaceData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/30">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 mt-4 tracking-wide animate-pulse">Syncing with database...</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/30 px-6">
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl max-w-sm text-center space-y-3">
          <Info className="text-rose-500 mx-auto" size={24} />
          <h3 className="font-bold text-slate-800 text-sm">Data Synced, Format Mismatch</h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            The data for ID <span className="font-mono text-[10px] bg-white p-1 rounded border">{id}</span> was loaded, but keys are incompatible.
          </p>
          <Link to="/" className="inline-block bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95">
            Return to Explorations
          </Link>
        </div>
      </div>
    );
  }

  const renderImage = place.image || place.imageUrl || "https://images.unsplash.com/photo-1588598126265-fba9397623fd?q=80&w=1000";
  const renderLocation = place.location || place.district || "Sri Lanka";
  const renderCost = place.cost || place.estimatedCosts || "Variable";
  
  // 🗺️ Default Fallback Map (Nine Arches Bridge Embed URL) if no link exists in DB
  const renderMap = place.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.4241724590325!2d81.05834887584102!3d6.839665519401764!2m3!1f0!2f0!3f0!3m2!1i1024!2i1024!3m4!1s0x3ae4659f80029b95%3A0xc4eb7ea39912061!8m2!3d6.8396602!4d81.0609238!5m2!1sen!2slk";

  return (
    <div className="min-h-screen bg-slate-50/40 pb-24 font-sans">
      
      {/* COVER IMAGE BANNER */}
      <div className="relative h-[45vh] w-full bg-slate-900">
        <img src={renderImage} alt={place.name} className="w-full h-full object-cover opacity-75 brightness-[0.85]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        
        <div className="absolute top-8 left-8 z-10">
          <Link to="/" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Destinations
          </Link>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                <Shield size={10} className="fill-white/20" /> {place.category || 'Vetted Destination'}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
                {place.name}
              </h1>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200 mt-1">
                <MapPin size={14} className="text-blue-400" />
                <span>{renderLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE CONTENT LAYOUT */}
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-start">
        
        {/* LEFT EXPLANATION COLUMN */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-6">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detailed Explanation</h2>
            <p className="text-slate-800 text-sm font-semibold mt-1 tracking-tight">Comprehensive Destination Briefing</p>
          </div>
          
          <p className="text-xs font-medium text-slate-600 leading-relaxed tracking-normal whitespace-pre-line">
            {place.description}
          </p>

          {/* TWO COLUMN ASSETS AREA - IMAGE + LIVE MAP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {/* Gallery Image */}
            <div className="h-44 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
              <img src={renderImage} alt="Detail view" className="w-full h-full object-cover" />
            </div>
            
            {/* 🗺️ DYNAMIC LIVE GOOGLE MAP WEBVIEW */}
            <div className="h-44 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm relative">
              <iframe
                title="Google Maps Location Verified"
                src={renderMap}
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* RIGHT QUICK METRICS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Metrics</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50/60 border border-slate-100/80 p-3 rounded-xl">
                <div className="w-8 h-8 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Wallet size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Budget</p>
                  <p className="font-extrabold text-slate-800 text-xs mt-0.5">LKR {renderCost} up</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50/60 border border-slate-100/80 p-3 rounded-xl">
                <div className="w-8 h-8 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                  <Clock size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visit Timing</p>
                  <p className="font-extrabold text-slate-800 text-xs mt-0.5">Daytime Operations</p>
                </div>
              </div>
            </div>

            <Link 
              to="/planner" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-sm shadow-blue-600/10 mt-2"
            >
              <Compass size={14} strokeWidth={2.5} />
              Build AI Itinerary with this Destination
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceDetails;