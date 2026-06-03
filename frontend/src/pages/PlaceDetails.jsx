import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPlaceById } from '../api';
import { MapPin, ArrowLeft, DollarSign, Bookmark, Compass } from 'lucide-react';

const PlaceDetails = () => {
  const { id } = useParams(); //url eken id kiyana eka kiyawa genima
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlaceData = async () => {
      try {
        const { data } = await fetchPlaceById(id);
        setPlace(data);
      } catch (error) {
        console.error("Error fetching destination details:", error);
      } finally {
        setLoading(false);
      }
    };
    getPlaceData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-500 text-xs font-semibold gap-3">
        <p>Destination details could not be found.</p>
        <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        
        {/* BACK NAVIGATION ACTION */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Explorations
        </Link>

        {/* TWO-COLUMN PREMIUM CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT AREA: HIGH RES MEDIA GALLERIES */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100">
              <img 
                src={place.image} 
                alt={place.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Multi-photo grid loop setup (If backend contains extra gallery loops, otherwise shows clean preview placeholders) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-slate-100 border border-slate-200/60 rounded-xl overflow-hidden cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                <img src={place.image} alt="View 1" className="w-full h-full object-cover brightness-95" />
              </div>
              <div className="h-24 bg-slate-100 border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Landscape view
              </div>
              <div className="h-24 bg-slate-100 border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Cultural context
              </div>
            </div>
          </div>

          {/* RIGHT AREA: STRUCTURAL NARRATIVES */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
            
            <div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                {place.category || 'Verified Vibe'}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {place.name}
              </h1>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mt-2">
                <MapPin size={14} className="text-blue-600" />
                <span>{place.location}, Sri Lanka</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* DESCRIPTION PORTION */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Overview</h3>
              <p className="text-xs font-medium text-slate-600 leading-relaxed tracking-normal">
                {place.description}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* METRICS SPECIFICATION GRID */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/70 border border-slate-100 p-3.5 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget Estimate</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">LKR {place.cost}</p>
              </div>
              <div className="bg-slate-50/70 border border-slate-100 p-3.5 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Status</p>
                <p className="font-bold text-emerald-600 text-sm mt-0.5">Open Public</p>
              </div>
            </div>

            {/* CALL TO ACTION HUB */}
            <Link 
              to="/planner" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-sm shadow-blue-600/10 mt-4"
            >
              <Compass size={15} />
              Generate AI Itinerary for this Place
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PlaceDetails;