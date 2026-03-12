import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ExportSection from '../components/dashboard/ExportSection';
import AIActions from '../components/dashboard/AIActions';

const Settings = () => {
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
                Please upload a resume first to access platform settings for your Digital Twin.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 flex items-center">
                    <SettingsIcon className="h-8 w-8 text-gray-500 mr-4" />
                    Platform Settings
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed font-medium">
                    Manage your Digital Twin data, rebuild career profiles, and export information. Themes can be toggled via the main navigation bar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
                <div className="flex flex-col h-full">
                    <AIActions />
                </div>

                <div className="flex flex-col h-full">
                    <ExportSection twin={twin} />
                </div>
            </div>
        </div>
    );
};

export default Settings;
