import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

const Hero = () => {
  
  return (
    <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* BACKGROUND VIDEO ELEMENT */}
      <video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover brightness-[0.45] scale-[1.01]"
>
  <source src="/Public/videos/bg-loop.mp4" type="video/mp4" /> 
   
      </video>

      {/* CORE TEXT CONTENT CONTENT OVERLAY */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Mini Status Tag */}
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white font-medium text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          Next-Gen Ceylon Exploration
        </div>

        {/* Master Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Explore Sri Lanka Guided by <span className="text-blue-400 font-black">Intelligence</span>
        </h1>
        
        <p className="text-sm md:text-base text-slate-200 mt-4 max-w-xl font-medium tracking-normal leading-relaxed">
          Unlock tailored travel structures mapped by generative AI systems and book government-vetted local experts seamlessly.
        </p>

        {/* HIGH CONTRAST SEARCH WRAPPER CARD */}
        <div className="w-full max-w-lg bg-white p-2 rounded-2xl border border-slate-200/40 shadow-xl shadow-black/10 mt-10 flex items-center gap-2">
          <div className="flex items-center gap-2 pl-3 flex-1 text-slate-400">
            <Search size={16} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Where do you want to go? (e.g. Ella, Kandy...)" 
              className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <Link 
            to="/planner" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-sm shadow-blue-600/10 shrink-0"
          >
            Start Exploring <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Hero;