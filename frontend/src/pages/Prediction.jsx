import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import CareerPredictionComponent from '../components/dashboard/CareerPrediction';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';

const Prediction = () => {
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

    const handleUpdateTarget = async (role) => {
        try {
            if (!role) return;
            const res = await api.post('/target/update', { targetRole: role });
            await loadTwin(true);
            toast.success(res.data.message || `Target updated to ${role}`);
        } catch (err) {
            toast.error('Failed to update target');
            console.error(err);
        }
    };

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
                Please upload a resume first to view your career predictions.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 flex items-center">
                    <TrendingUp className="h-8 w-8 text-primary-600 mr-4" />
                    Career Prediction Engine
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed font-medium">
                    Explore potential career trajectories, compare the viability of different roles, and track your metrics over time.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col h-full">
                    <CareerPredictionComponent twin={twin} onUpdateTarget={handleUpdateTarget} />
                </div>

                <div className="flex flex-col h-full space-y-8">
                    <PerformanceMetrics twin={twin} />

                    {/* Add a static interpretation card */}
                    <div className="bg-primary-50 dark:bg-primary-900/10 p-8 rounded-3xl border border-primary-100 dark:border-primary-800/20 flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Understanding Your Scores</h3>
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            <li><strong className="text-primary-600 dark:text-primary-400">Alignment:</strong> How well your current skills match your stated target role.</li>
                            <li><strong className="text-primary-600 dark:text-primary-400">Readiness:</strong> An overall metric of how prepared you are for interviews in your domain.</li>
                            <li><strong className="text-primary-600 dark:text-primary-400">Strength:</strong> A composite score of the quality, depth, and relevance of your technical skills.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prediction;
