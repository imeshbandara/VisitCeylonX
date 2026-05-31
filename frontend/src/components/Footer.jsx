import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart } from 'lucide-react'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto px-8 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform w-fit">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm">
                <Compass size={16} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900">
                VisitCeylon<span className="text-blue-600">X</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Empowering global travelers with generative AI itineraries and trusted, government-vetted local expertise.
            </p>
          </div>

          {/* ECOSYSTEM LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ecosystem</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Home Platform</Link></li>
              <li><Link to="/planner" className="hover:text-blue-600 transition-colors">✨ AI Travel Planner</Link></li>
              <li><Link to="/guides" className="hover:text-blue-600 transition-colors">Verified Tour Guides</Link></li>
            </ul>
          </div>

          {/* PORTALS LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Join Us</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/register" className="hover:text-blue-600 transition-colors">Register as Tourist</Link></li>
              <li><Link to="/register" className="hover:text-blue-600 transition-colors">Join as Certified Guide</Link></li>
              <li><Link to="/login" className="hover:text-blue-600 transition-colors">Console Sign In</Link></li>
            </ul>
          </div>

          {/* DEVELOPER LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Developer Links</h4>
            <div className="flex items-center gap-3 text-slate-500">
              
              {/* NATIVE GITHUB SVG */}
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>

              {/* NATIVE LINKEDIN SVG */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* NATIVE GLOBE SVG */}
              <a 
                href="#" 
                className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* LOWER BAR */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-semibold text-slate-400">
          <div>© {currentYear} VisitCeylonX. All rights reserved.</div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Crafted with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>for modern exploration.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;