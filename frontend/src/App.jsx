import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen">
      {/* The Navbar will stay fixed at the top */}
      <Navbar />
      
      <main>
        {/* The Hero section is the first part of our Home Page */}
        <Hero />
        
        {/* We will add the Explore section and Guide section here next */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
           <h2 className="text-3xl font-bold text-primary mb-2">Popular Destinations</h2>
           <p className="text-textSecondary mb-10">Handpicked places just for you.</p>
           
           {/* Place Cards will go here */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cards will be mapped here soon */}
           </div>
        </section>
      </main>
    </div>
  );
}

export default App;