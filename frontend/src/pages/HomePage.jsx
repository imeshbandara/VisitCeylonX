import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import PlaceCard from '../components/PlaceCard';
import { fetchPlaces } from '../api';

const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const { data } = await fetchPlaces();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };
    getPlaces();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Video Hero Section */}
      <Hero />
      
      {/* POPULAR PLACES CONTAINER CONTENT */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
            Curated Collections
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Popular Destinations
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Explore the most beautiful places in Sri Lanka.
          </p>
        </div>

        {loading ? (
          /* Premium clean skeleton pulse placeholder */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-72 rounded-2xl border border-slate-100 p-4 space-y-4 animate-pulse">
                <div className="bg-slate-100 h-44 w-full rounded-xl" />
                <div className="h-4 bg-slate-100 w-2/3 rounded-md" />
                <div className="h-3 bg-slate-100 w-1/2 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          /* Structured Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;