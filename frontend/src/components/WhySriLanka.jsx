import React from 'react';

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
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Why should you visit <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Sri Lanka?</span>
            </h2>
          </div>
        </div>
        
        {/* Right Column (The Matrix) */}
      </div>
    </section>
  );
};

export default WhySriLanka;
