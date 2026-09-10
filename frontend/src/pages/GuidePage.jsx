import React, { useEffect, useState } from 'react';
import GuideCard from '../components/GuideCard';
import BookingButton from '../components/BookingButton';
import { fetchGuides } from '../api';
import { Compass, Users, Sparkles } from 'lucide-react';

const GuidePage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGuides = async () => {
      try {
        const { data } = await fetchGuides();
        setGuides(data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setLoading(false);
      }
    };
    getGuides();
  }, []);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 border border-emerald-100">
          <Sparkles size={14} />
          <span>Government Vetted & Certified</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
          Find Your Certified Tour Guide
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Connect with trusted local experts across Sri Lanka. Book directly with credit or debit card for transparent and verified experiences.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Searching for available guides...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {guides.length > 0 ? (
            guides.map(guide => (
              <div 
                key={guide._id} 
                className="flex flex-col justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all duration-200"
              >
                <GuideCard guide={guide} />
                
                {/* Direct Card Payment Integration */}
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <BookingButton 
                    amount="25.00" 
                    guideId={guide._id} 
                    guideName={guide.fullName} 
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100 p-8">
              <Users size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-semibold text-slate-700">No guides found</h3>
              <p className="text-slate-500 text-sm mt-1">Please check back later or register as a guide.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidePage;