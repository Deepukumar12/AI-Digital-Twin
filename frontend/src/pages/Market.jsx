import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import api from '../api/axios';
import MarketTrends from '../components/dashboard/MarketTrends';

const Market = () => {
    const [twin, setTwin] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadTwin = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const response = await api.get('/twin');
            setTwin(response.data.twin);
        } catch (err) {
            console.error(err);
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        loadTwin();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!twin) {
        return (
            <div className="text-center py-20 text-gray-500">
                Please upload a resume first to view job market insights relevant to your profile.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 flex items-center">
                    <Briefcase className="h-8 w-8 text-green-500 mr-4" />
                    Job Market Insights
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed font-medium">
                    Dive into real-time job openings, top requested skills, and the current hiring landscape for your target career.
                </p>
            </div>

            <div className="mx-auto w-full max-w-5xl">
                <div className="h-[800px] flex flex-col">
                    <MarketTrends domain={(twin.target_role && twin.target_role !== 'Not Set') ? twin.target_role : twin.primary_domain} />
                </div>
            </div>
        </div>
    );
};

export default Market;
