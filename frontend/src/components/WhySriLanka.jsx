import React from 'react';

const WhySriLanka = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-slate-50 overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-5 bg-cover bg-center bg-no-repeat backdrop-blur-xl"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1588096344392-56490dd84370?q=80&w=2070&auto=format&fit=crop")' }}
      />
      {/* Component Content */}
    </section>
  );
};

export default WhySriLanka;
