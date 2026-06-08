import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Droplets, Wind, Thermometer,
  Compass, Navigation, Calendar, Shirt, AlertTriangle, LogOut, User
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const destinationWeatherData = {
  ella: {
    name: "Ella", district: "Badulla",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1000",
    temp: 22, condition: "Partly Cloudy", humidity: 70, wind: 12, uv: 4,
    sunrise: "05:54 AM", sunset: "06:18 PM",
    bestSeason: "December – April",
    whyVisit: "Pleasant temperatures, clear skies, ideal for mountain hiking & photography.",
    forecast: [
      { day: "Mon", icon: "☀️", max: 24, min: 18, rain: 10 },
      { day: "Tue", icon: "🌧️", max: 21, min: 16, rain: 75 },
      { day: "Wed", icon: "⛅", max: 23, min: 17, rain: 20 },
      { day: "Thu", icon: "☀️", max: 25, min: 18, rain: 5 },
      { day: "Fri", icon: "🌧️", max: 20, min: 15, rain: 80 },
      { day: "Sat", icon: "⛅", max: 22, min: 17, rain: 30 },
      { day: "Sun", icon: "☀️", max: 24, min: 18, rain: 10 },
    ],
    chartData: [
      { name: 'Jan', temp: 20, rain: 40 }, { name: 'Feb', temp: 21, rain: 30 },
      { name: 'Mar', temp: 23, rain: 50 }, { name: 'Apr', temp: 24, rain: 90 },
      { name: 'May', temp: 23, rain: 80 }, { name: 'Jun', temp: 22, rain: 40 },
      { name: 'Jul', temp: 22, rain: 35 }, { name: 'Aug', temp: 22, rain: 45 },
      { name: 'Sep', temp: 23, rain: 70 }, { name: 'Oct', temp: 22, rain: 120 },
      { name: 'Nov', temp: 21, rain: 140 }, { name: 'Dec', temp: 20, rain: 80 },
    ],
    type: "Cool",
  },
  mirissa: {
    name: "Mirissa", district: "Matara",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000",
    temp: 30, condition: "Sunny Beach Day", humidity: 65, wind: 18, uv: 9,
    sunrise: "05:58 AM", sunset: "06:22 PM",
    bestSeason: "November – April",
    whyVisit: "Crystal clear waters, calm waves perfect for whale watching and beach surfing.",
    forecast: [
      { day: "Mon", icon: "☀️", max: 31, min: 25, rain: 0 },
      { day: "Tue", icon: "☀️", max: 30, min: 26, rain: 5 },
      { day: "Wed", icon: "⛅", max: 30, min: 25, rain: 15 },
      { day: "Thu", icon: "🌧️", max: 28, min: 24, rain: 60 },
      { day: "Fri", icon: "☀️", max: 31, min: 26, rain: 10 },
      { day: "Sat", icon: "☀️", max: 32, min: 27, rain: 0 },
      { day: "Sun", icon: "☀️", max: 31, min: 25, rain: 5 },
    ],
    chartData: [
      { name: 'Jan', temp: 29, rain: 20 }, { name: 'Feb', temp: 30, rain: 15 },
      { name: 'Mar', temp: 31, rain: 25 }, { name: 'Apr', temp: 32, rain: 60 },
      { name: 'May', temp: 30, rain: 110 }, { name: 'Jun', temp: 29, rain: 95 },
      { name: 'Jul', temp: 29, rain: 80 }, { name: 'Aug', temp: 29, rain: 75 },
      { name: 'Sep', temp: 30, rain: 85 }, { name: 'Oct', temp: 29, rain: 130 },
      { name: 'Nov', temp: 29, rain: 90 }, { name: 'Dec', temp: 29, rain: 40 },
    ],
    type: "Sunny",
  },
};

const mapDestinations = [
  { id: 'ella',        name: 'Ella',        top: '65%', left: '55%' },
  { id: 'mirissa',     name: 'Mirissa',     top: '88%', left: '48%' },
  { id: 'sigiriya',    name: 'Sigiriya',    top: '38%', left: '52%' },
  { id: 'nuwaraeliya', name: 'Nuwara Eliya',top: '58%', left: '50%' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function WeatherGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKey, setActiveKey] = useState('ella');
  const d = destinationWeatherData[activeKey] || destinationWeatherData.ella;

  const handleSearch = (e) => {
    e.preventDefault();
    const key = searchQuery.toLowerCase().trim();
    if (destinationWeatherData[key]) setActiveKey(key);
    else alert("Try 'Ella' or 'Mirissa'.");
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f4f6f9', minHeight: '100vh', color: '#0d1b2a' }}>

      {/* ── NAV ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a6b5c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#0d1b2a', letterSpacing: '-0.3px' }}>VisitCeylonX</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#5a6a7a', cursor: 'pointer' }}>Home</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#5a6a7a', cursor: 'pointer' }}>Find Guide</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1a6b5c', cursor: 'pointer' }}>Weather</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8ecf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={15} color="#5a6a7a" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0d1b2a' }}>Imesh</span>
          <LogOut size={15} color="#aab5bf" style={{ cursor: 'pointer' }} />
        </div>
      </nav>

      {/* ── HERO SEARCH BANNER ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '48px 32px 40px', textAlign: 'center' }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e8f5f1', color: '#1a6b5c', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, marginBottom: 16 }}
        >
          🌦️ Next-Gen Travel Planning
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ fontSize: 36, fontWeight: 800, color: '#0d1b2a', letterSpacing: '-0.8px', margin: '0 0 10px', lineHeight: 1.15 }}
        >
          Sri Lanka <span style={{ color: '#1a6b5c' }}>Weather Intelligence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          style={{ fontSize: 13, color: '#7a8a9a', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}
        >
          Real-time micro-climate shifts, multi-day forecasts, and seasonal guides for every Sri Lankan destination.
        </motion.p>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          style={{ maxWidth: 480, margin: '0 auto', display: 'flex', background: '#f4f6f9', border: '1.5px solid #dde3ea', borderRadius: 12, overflow: 'hidden', alignItems: 'center', padding: '4px 4px 4px 14px' }}
        >
          <Search size={16} color="#9aabba" style={{ flexShrink: 0 }} />
          <input
            type="text" placeholder="Search destinations (Ella, Mirissa…)"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#0d1b2a', padding: '8px 10px', fontFamily: 'inherit' }}
          />
          <button
            type="submit"
            style={{ background: '#1a6b5c', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', padding: '10px 20px', borderRadius: 9, cursor: 'pointer', letterSpacing: '0.02em' }}
          >
            Search
          </button>
        </motion.form>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >

            {/* Destination + Live Weather */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>

              {/* Cover Card */}
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 240, background: '#0d1b2a' }}>
                <img src={d.image} alt={d.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,27,42,0.85) 30%, transparent)' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#6dd5b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    <MapPin size={10} />{d.district}
                  </div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>{d.name}</h2>
                </div>
              </div>

              {/* Weather Stats */}
              <div style={{ background: '#fff', border: '1.5px solid #e8ecf0', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#9aabba', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Conditions</p>
                    <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 700, color: '#0d1b2a' }}>{d.condition}</h3>
                  </div>
                  <span style={{ fontSize: 36 }}>{d.type === 'Cool' ? '⛅' : '☀️'}</span>
                </div>
                <div style={{ fontSize: 52, fontWeight: 800, color: '#0d1b2a', letterSpacing: '-2px', margin: '12px 0' }}>{d.temp}°C</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, borderTop: '1px solid #f0f3f6', paddingTop: 14 }}>
                  {[
                    { icon: <Droplets size={13} color="#3b7ef8" />, label: `${d.humidity}%`, sub: 'Humidity' },
                    { icon: <Wind size={13} color="#1a6b5c" />, label: `${d.wind} km/h`, sub: 'Wind' },
                    { icon: <Thermometer size={13} color="#f59e0b" />, label: `UV ${d.uv}`, sub: 'Index' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center', background: '#f8fafc', borderRadius: 10, padding: '8px 4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{s.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0d1b2a' }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: '#9aabba' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div style={{ background: '#fff', border: '1.5px solid #e8ecf0', borderRadius: 16, padding: '20px 20px 16px' }}>
              <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: '#9aabba', textTransform: 'uppercase', letterSpacing: '0.08em' }}>7-Day Forecast</p>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                {d.forecast.map((f, i) => (
                  <div key={i} style={{ minWidth: 88, background: '#f8fafc', border: '1.5px solid #e8ecf0', borderRadius: 12, padding: '12px 8px', textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#5a6a7a' }}>{f.day}</p>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                    <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#0d1b2a' }}>{f.max}° <span style={{ color: '#aab5bf' }}>{f.min}°</span></p>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#3b7ef8', background: '#ebf1ff', padding: '2px 6px', borderRadius: 6 }}>{f.rain}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Season */}
            <div style={{ background: '#fff', border: '1.5px solid #e8ecf0', borderRadius: 16, padding: 20, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#1a6b5c', background: '#e8f5f1', padding: '3px 10px', borderRadius: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best Season</span>
                <h4 style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 800, color: '#0d1b2a', letterSpacing: '-0.3px' }}>{d.bestSeason}</h4>
              </div>
              <div style={{ borderLeft: '2px solid #f0f3f6', paddingLeft: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Calendar size={13} color="#3b7ef8" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0d1b2a' }}>Seasonal Highlights</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#5a6a7a', lineHeight: 1.6 }}>{d.whyVisit}</p>
              </div>
            </div>

            {/* Annual Chart */}
            <div style={{ background: '#fff', border: '1.5px solid #e8ecf0', borderRadius: 16, padding: 20 }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#9aabba', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Annual Overview</p>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0d1b2a' }}>Temperature & Precipitation Curve</p>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={d.chartData} margin={{ top: 5, right: 10, left: -22, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9aabba' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9aabba' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 10, fontSize: 12 }} />
                    <Area type="monotone" dataKey="temp" name="Temp °C" stroke="#3b7ef8" fill="#ebf1ff" strokeWidth={2} fillOpacity={0.5} />
                    <Area type="monotone" dataKey="rain" name="Rainfall mm" stroke="#1a6b5c" fill="#e8f5f1" strokeWidth={2} fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activities + Packing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', border: '1.5px solid #e8ecf0', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <Compass size={14} color="#3b7ef8" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0d1b2a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Activities</span>
                </div>
                {d.type === 'Cool' ? (
                  <>
                    <div style={activityStyle}>🌲 Nine Arch Bridge Trekking</div>
                    <div style={activityStyle}>🍃 Little Adam's Peak Walks</div>
                  </>
                ) : (
                  <>
                    <div style={activityStyle}>🏄 Coral Reef Snorkeling</div>
                    <div style={activityStyle}>🐋 Whale Watching Cruises</div>
                  </>
                )}
              </div>
              <div style={{ background: '#fff', border: '1.5px solid #e8ecf0', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <Shirt size={14} color="#1a6b5c" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0d1b2a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Packing</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {(d.type === 'Cool'
                    ? ['🧥 Light Jacket', '👟 Trek Shoes']
                    : ['🕶️ Sunglasses', '🧴 Sunscreen']
                  ).concat(['👕 Light Clothes', '⛱️ Umbrella']).map((item, i) => (
                    <div key={i} style={packStyle}>{item}</div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Advisory */}
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={16} color="#d97706" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Meteorological Advisories</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#0d1b2a' }}>High UV Index Warning</p>
              <p style={{ margin: 0, fontSize: 11, color: '#7a6a3a', lineHeight: 1.5 }}>Southern maritime zones showing radiation values above safe limits. Apply SPF 50+.</p>
            </div>
          </div>

          {/* Interactive Map */}
          <div style={{ background: '#fff', border: '1.5px solid #e8ecf0', borderRadius: 16, padding: 20 }}>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#9aabba', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Destination Map</p>
            <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#0d1b2a' }}>Interactive Ceylon Nodes</p>

            <div style={{ background: '#f4f6f9', border: '1.5px solid #e8ecf0', borderRadius: 12, height: 360, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* subtle bg texture */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 60%, #e8f5f1 0%, #f4f6f9 60%)', opacity: 0.8 }} />

              {/* Sri Lanka outline placeholder */}
              <div style={{ position: 'relative', width: 140, height: 240, border: '2px dashed #d0d8e0', borderRadius: '50% 50% 48% 52% / 46% 46% 54% 54%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: '#b0bec8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Indian<br/>Ocean</span>

                {mapDestinations.map(m => (
                  <button
                    key={m.id}
                    onClick={() => destinationWeatherData[m.id] && setActiveKey(m.id)}
                    style={{
                      position: 'absolute', top: m.top, left: m.left,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: activeKey === m.id ? '#1a6b5c' : '#fff',
                      color: activeKey === m.id ? '#fff' : '#5a6a7a',
                      border: `1.5px solid ${activeKey === m.id ? '#1a6b5c' : '#dde3ea'}`,
                      fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                      padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                      boxShadow: activeKey === m.id ? '0 2px 10px rgba(26,107,92,0.3)' : '0 1px 4px rgba(0,0,0,0.08)',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Navigation size={7} style={{ transform: 'rotate(45deg)' }} />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Helpers ──
const activityStyle = {
  background: '#f8fafc', border: '1.5px solid #e8ecf0', borderRadius: 10,
  padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#2d3e50',
  marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6,
};
const packStyle = {
  background: '#f8fafc', border: '1.5px solid #e8ecf0', borderRadius: 10,
  padding: '8px', fontSize: 11, fontWeight: 700, color: '#2d3e50',
  textAlign: 'center',
};
