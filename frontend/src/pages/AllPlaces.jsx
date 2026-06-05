import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlaces } from '../api.js';
import PlaceCard from '../components/PlaceCard.jsx';
import { ArrowLeft, Globe } from 'lucide-react';

const AllPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllPlaces = async () => {
      try {
        const { data } = await fetchPlaces();
        setPlaces(data);
      } catch (error) {
        console.error("Error loading all places:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPlaces();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-8 pt-8">
        
        {/* BACK TO HOME NAV */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Overview
        </Link>

        {/* PAGE TITLE */}
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Globe className="text-blue-600" size={24} />
            All Wandering Destinations of Sri Lanka 📸
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            A complete roster of verified Sri Lankan gems logged into our ecosystem database.
          </p>
        </div>

        {/* ALL PLACES GRID (SHOWS EVERYTHING) */}
        {places.length === 0 ? (
          <div className="text-center py-12 text-xs font-semibold text-slate-400">No places found inside the database.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllPlaces;