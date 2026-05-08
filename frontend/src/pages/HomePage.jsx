import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import PlaceCard from '../components/PlaceCard';
import { fetchPlaces } from '../api';

const HomePage = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPlaces = async () => {
            try {
                const { data } = await fetchPlaces();
                setPlaces(data); // Backend eken daththa places state ekata damai
            } catch (error) {
                console.error("Error fetching places:", error);
            } finally {
                setLoading(false);
            }
        };
        getPlaces();
    }, []);

    return (
        <div>
            <Hero />
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-primary mb-2">Popular Destinations</h2>
                    <p className="text-textSecondary">Explore the most beautiful places in Sri Lanka.</p>
                </div>

                {loading ? (
                    <p>Loading places...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {places.map((place) => (
                            <PlaceCard key={place._id} place={place} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;