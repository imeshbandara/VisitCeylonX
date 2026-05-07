import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/30" /> {/* Dark overlay for readability */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Experience the Magic of <span className="text-secondary">Ceylon</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-white/90 mb-10 font-light"
        >
          Discover hidden gems, plan smart itineraries, and find expert guides for your journey.
        </motion.p>

        {/* Search Bar / Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20"
        >
          <div className="flex items-center gap-3 px-4 py-3 w-full md:w-80 bg-white rounded-xl text-textSecondary">
            <Search size={20} className="text-primary" />
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="bg-transparent border-none outline-none w-full text-textPrimary"
            />
          </div>
          <button className="w-full md:w-auto bg-primary text-white px-8 py-3.5 rounded-xl font-medium hover:bg-teal-700 transition-all shadow-lg">
            Start Exploring
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;