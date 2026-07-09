import React from 'react';
import { Leaf, Landmark, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const WhySriLanka = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-slate-50 overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-5 bg-cover bg-center bg-no-repeat backdrop-blur-xl"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1588096344392-56490dd84370?q=80&w=2070&auto=format&fit=crop")' }}
      />
      
      {/* Inner Grid Structure */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
  {/* Left Column (The Hook) */}
  <div className="lg:col-span-5 relative">
  <div className="sticky top-32">
    <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
      Why should you visit <br/>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
        Sri Lanka?
      </span>
    </h2>
    <p className="mt-6 text-slate-500 font-medium text-lg max-w-md leading-relaxed">
      Discover a land of endless exploration, where ancient temples, dense jungles, and golden beaches coexist in perfect harmony.
    </p>
  </div>
</div>
        
        {/* Right Column (The Matrix) */}
        <div className="lg:col-span-7 flex flex-col gap-8 mt-12 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6 items-start hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-24 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Leaf className="text-emerald-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Unrivaled Biodiversity</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Home to an incredible variety of wildlife, ecosystems, and natural landscapes found within a small island.</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6 items-start hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-24 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <Landmark className="text-orange-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2500+ Years of Living History</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Discover ancient kingdoms, sacred temples, and timeless heritage that have shaped Sri Lanka for over 2,500 years.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-slate-100 flex gap-6 items-start hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-24 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <HeartHandshake className="text-rose-500" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">The Warmest Hospitality Matrix</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Experience the genuine warmth, kindness, and welcoming spirit of Sri Lankan people.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhySriLanka;
