import React, { useEffect, useState } from 'react';
import GuideCard from '../components/GuideCard';
import BookingButton from '../components/BookingButton';
import { fetchGuides } from '../api';

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
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* ... Title and Header ... */}

      {loading ? (
        <div className="text-center py-20 text-textSecondary">Searching for guides...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.length > 0 ? (
            guides.map(guide => (
              <div key={guide._id} className="flex flex-col bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <GuideCard guide={guide} />
                
                {/* 2. Add the payment button right underneath the card for testing */}
                <div className="mt-4 border-t border-dashed border-slate-100 pt-4">
                  <BookingButton amount="25.00" guideId={guide._id} />
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-textSecondary">No guides available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidePage;