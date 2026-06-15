import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Droplets, Wind, Thermometer, 
  Compass, Shirt, AlertTriangle, Navigation, Calendar 
} from 'lucide-react';
import axios from 'axios';

// ⚠️ ඔයාගේ ක්‍රියාකාරී OpenWeatherMap API Key එක මෙතන තියෙනවා
const WEATHER_API_KEY = "0811c3ae7e13ff70a860362960455f63"; 

const WeatherGuide = () => {
  const [searchQuery, setSearchQuery] = useState('Colombo');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]); // 🛠️ 5-Day Forecast සේව් කිරීමට අලුත් state එකක්
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. සජීවී දත්ත සහ 5-Day Forecast එක එකවර ලබාගන්නා ප්‍රධාන Function එක
  const fetchLiveWeatherAndForecast = async (city) => {
    try {
      setLoading(true);
      setError(null);
      
      // API Call 1: Current Weather Data
      const currentWeatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},LK&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      // API Call 2: 5-Day / 3-Hour Forecast Data
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},LK&units=metric&appid=${WEATHER_API_KEY}`
      );

      // 🛠️ FILTER LOGIC: පැය 3න් 3ට එන දත්ත වලින් දිනකට එක බැගින් (දහවල් 12:00 දත්ත) වෙන් කර ගැනීම
      const dailyForecasts = forecastRes.data.list.filter((item) => {
        return item.dt_txt.includes("12:00:00");
      }).map((item) => {
        // දිනය පාවිච්චි කරලා සතියේ දවස (Mon, Tue) සොයා ගැනීම
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return {
          day: dayName,
          icon: item.weather[0].icon,
          condition: item.weather[0].main,
          max: Math.round(item.main.temp_max),
          min: Math.round(item.main.temp_min),
          rain: Math.round(item.pop * 100) // item.pop එකෙන් වැස්ස වැටීමේ ප්‍රතිශතය (0 සිට 1 දක්වා) ලැබෙනවා
        };
      });

      setWeatherData(currentWeatherRes.data);
      setForecastData(dailyForecasts); // Forecast State එකට දත්ත ඇතුලත් කිරීම
    } catch (err) {
      console.error("Ecosystem Sync Failed:", err);
      setError("Destination not found or network error. Please try another city in Sri Lanka.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeatherAndForecast('Colombo');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      fetchLiveWeatherAndForecast(searchQuery.trim());
    }
  };

  const isRainy = weatherData?.weather[0]?.main?.toLowerCase().includes('rain');
  const isCool = weatherData?.main?.temp <= 22;
  const dynamicCityImage = `https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 font-sans overflow-x-hidden pb-24">
      
      {/* 1. HERO GLASSMORPHISM SEARCH BANNER */}
      <div className="relative h-[48vh] w-full flex items-center justify-center px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588598126265-fba9397623fd?q=80&w=1400')] bg-cover bg-center opacity-25 brightness-75 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative max-w-3xl w-full text-center space-y-6 z-10">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-blue-400 font-black text-xs uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
            Live Satellite Connection Enabled
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
            Plan Your Journey with <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Real-Time Weather</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xs md:text-sm text-slate-400 font-medium max-w-xl mx-auto">
            Search any city across Sri Lanka to fetch live meteorological data and upcoming 5-day forecasts instantly.
          </motion.p>

          {/* Search Box */}
          <motion.form initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative group mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-2">
              <Search className="text-slate-400 ml-3 shrink-0" size={18} />
              <input 
                type="text" 
                placeholder="Search any destination (e.g. Ella, Jaffna, Galle, Trincomalee...)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-white placeholder-slate-500 text-xs py-2.5 font-medium"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 shrink-0">
                Check Weather
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* CORE HUB LAYOUT SECTION */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-12">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold p-4 rounded-xl text-center">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="min-h-[300px] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500 mt-3 animate-pulse">Contacting Satellite Node Matrices...</p>
            </div>
          ) : (
            weatherData && (
              <>
                <AnimatePresence mode="wait">
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Destination Cover Card */}
                    <div className="md:col-span-5 rounded-3xl overflow-hidden relative min-h-[260px] bg-slate-900 border border-white/5 group">
                      <img src={dynamicCityImage} alt={weatherData.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                          <MapPin size={12}/> Sri Lanka Ecosystem
                      </div>
                        <h2 className="text-3xl font-black mt-1 tracking-tight">{weatherData.name}</h2>
                      </div>
                    </div>

                    {/* Live Glassmorphism Weather Box */}
                    <div className="md:col-span-7 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Local Climate</p>
                          <h3 className="text-xl font-bold mt-0.5 text-white capitalize">
                            {weatherData.weather[0].description}
                          </h3>
                        </div>
                        <div className="text-4xl">
                          <img 
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                            alt="weather-icon" 
                            className="w-16 h-16 "
                          />
                        </div>
                      </div>

                      <div className="text-6xl font-black text-white my-2 tracking-tighter">
                        {Math.round(weatherData.main.temp)}°C
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 pt-4 text-xs font-semibold text-slate-400">
                        <div className="flex items-center gap-2"><Droplets size={14} className="text-blue-400"/> Humidity: {weatherData.main.humidity}%</div>
                        <div className="flex items-center gap-2"><Wind size={14} className="text-teal-400"/> Wind: {weatherData.wind.speed} m/s</div>
                        <div className="flex items-center gap-2"><Thermometer size={14} className="text-amber-400"/> Feels Like: {Math.round(weatherData.main.feels_like)}°C</div>
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>

                {/* 🛠️ NEW: REAL 5-DAY METEOROLOGICAL FORECAST MATRICES */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-500" /> Upcoming 5-Day Satellite Forecast
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
                    {forecastData.map((f, index) => (
                      <div key={index} className="w-32 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center space-y-2 shrink-0 snap-start hover:border-blue-500/40 hover:bg-white/[0.04] transition-all">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{f.day}</p>
                        <div className="flex justify-center">
                          <img src={`https://openweathermap.org/img/wn/${f.icon}.png`} alt="forecast-icon" className="w-10 h-10" />
                        </div>
                        <p className="text-xs font-black text-white">{f.max}°C / <span className="text-slate-500 text-[11px]">{f.min}°C</span></p>
                        <p className="text-[9px] font-black text-blue-400 bg-blue-500/10 py-1 rounded-md tracking-wide uppercase">{f.rain}% Rain</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          )}

          {/* DYNAMIC PACKING SUGGESTIONS & ACTIVITIES */}
          {weatherData && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} className="text-blue-400"/> Weather-Based Recommendations
                </h4>
                <div className="space-y-2.5 text-xs font-semibold">
                  {isRainy ? (
                    <>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2 text-amber-400">☕ Traditional Ceylon Tea Factory Indoor Tours</div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2 text-slate-300">🏛️ Historical Museum & Cultural Sightseeing</div>
                    </>
                  ) : isCool ? (
                    <>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2 text-emerald-400">🌲 Mountain Trekking & Hiking Expeditions</div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2 text-slate-300">🍃 Scenic Nature Walks & Tea Estate Exploration</div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2 text-cyan-400">🏄 Perfect Conditions for Beach Surfing & Snorkeling</div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2 text-slate-300">🐘 Wildlife Safari Excursions</div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Shirt size={14} className="text-emerald-400"/> Real-time Packing Suggestions
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-300">
                  {isRainy ? (
                    <>
                      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-xl text-center">☔ Heavy Raincoat</div>
                      <div className="bg-white/5 p-3 rounded-xl text-center">🌂 Umbrella</div>
                    </>
                  ) : isCool ? (
                    <>
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl text-center">🧥 Light Jacket</div>
                      <div className="bg-white/5 p-3 rounded-xl text-center">👟 Walking Shoes</div>
                    </>
                  ) : (
                    <>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center">🕶️ Sunglasses</div>
                      <div className="bg-white/5 p-3 rounded-xl text-center">🧴 Sunscreen Cream</div>
                    </>
                  )}
                  <div className="bg-white/5 p-3 rounded-xl text-center">👕 Light Cotton Wear</div>
                  <div className="bg-white/5 p-3 rounded-xl text-center">💧 Water Bottle</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Radar Quick Access Nodes</h4>
              <p className="text-slate-200 text-sm font-semibold mt-0.5 tracking-tight">One-Click Smart Query Links</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Galle', 'Kandy', 'Jaffna', 'Nuwara Eliya', 'Trincomalee', 'Anuradhapura'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchQuery(city);
                    fetchLiveWeatherAndForecast(city);
                  }}
                  className="bg-white/5 border border-white/5 hover:border-blue-500/40 text-slate-300 hover:text-white font-bold text-xs p-3 rounded-xl transition-all active:scale-95 text-left flex items-center justify-between"
                >
                  {city}
                  <Navigation size={10} className="rotate-45 opacity-40" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={18} />
              <h4 className="text-xs font-bold uppercase tracking-wider">Meteorological Advisories</h4>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              5-Day Dual Satellite synchronization complete. Live query routing maps search inputs natively to global climate matrix indexes.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WeatherGuide;