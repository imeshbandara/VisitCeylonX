import React, { useEffect, useState } from 'react';
import GuideCard from '../components/GuideCard';
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
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-textPrimary mb-4">Find Your Expert Guide</h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          Connect with professional, verified local guides to make your Sri Lankan journey unforgettable.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-textSecondary">Searching for guides...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.length > 0 ? (
            guides.map(guide => <GuideCard key={guide._id} guide={guide} />)
          ) : (
            <p className="col-span-full text-center text-textSecondary">No guides available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidePage;