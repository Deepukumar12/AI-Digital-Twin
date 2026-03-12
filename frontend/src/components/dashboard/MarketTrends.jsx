import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Briefcase, ExternalLink, RefreshCw, BarChart3, MapPin } from 'lucide-react';
import api from '../../api/axios';

const MarketTrends = ({ domain }) => {
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countryCode, setCountryCode] = useState('in');
    const [experience, setExperience] = useState('all');

    // Auto-scroll ref
    const scrollContainerRef = useRef(null);

    const fetchTrends = async () => {
        setLoading(true);
        try {
            // Fetch trends from the dedicated job market service
            // Append experience if it's not 'all'
            let queryUrl = `/job-market/${domain}?country=${countryCode}`;
            if (experience !== 'all') {
                queryUrl += `&experience=${encodeURIComponent(experience)}`;
            }
            const res = await api.get(queryUrl);
            setTrends(res.data);
        } catch (err) {
            console.error("Failed to fetch job market insights", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (domain) {
            fetchTrends();
        }
    }, [domain, countryCode, experience]);

    if (loading) return (
        <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 h-full flex flex-col items-center justify-center min-h-[300px]">
            <RefreshCw className="h-6 w-6 text-primary-600 animate-spin mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium italic">Fetching job market insights...</p>
        </div>
    );

    if (!trends) return null;

    const getRegionName = (code) => {
        const regions = { in: 'India', us: 'United States', gb: 'United Kingdom', ca: 'Canada', au: 'Australia', sg: 'Singapore' };
        return regions[code] || 'Global';
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 h-full w-full flex flex-col">
            <div className="flex flex-wrap items-start justify-between mb-8 gap-4">
                <div className="flex flex-col min-w-0">
                    <h3 className="text-2xl font-bold text-textPrimary dark:text-white flex flex-wrap items-center gap-2 tracking-tight">
                        <TrendingUp className="h-6 w-6 text-green-500 shrink-0" />
                        <span className="whitespace-nowrap">Job Market Insights</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center flex-wrap gap-1">
                        Live analytics &bull; <span className="font-bold text-primary-600">{trends.job_count > 0 ? trends.job_count.toLocaleString() : 'Many'} Openings</span> for <span className="font-bold text-gray-700 dark:text-gray-300">{domain}</span>
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:flex items-center whitespace-nowrap">
                            <MapPin className="h-3.5 w-3.5 mr-1" /> Experience
                        </span>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="bg-appBg dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 text-sm rounded-xl focus:ring-1 focus:ring-primary-600 focus:border-primary-600 block px-4 py-2 cursor-pointer font-bold outline-none transition-all shadow-sm"
                        >
                            <option value="all" className="dark:bg-gray-800">All Jobs</option>
                            <option value="0 years" className="dark:bg-gray-800">0 years</option>
                            <option value="0–1 year" className="dark:bg-gray-800">0–1 year</option>
                            <option value="1–2 years" className="dark:bg-gray-800">1–2 years</option>
                            <option value="2–5 years" className="dark:bg-gray-800">2–5 years</option>
                            <option value="5–8 years" className="dark:bg-gray-800">5–8 years</option>
                            <option value="7–10 years" className="dark:bg-gray-800">7–10 years</option>
                            <option value="8–12 years" className="dark:bg-gray-800">8–12 years</option>
                            <option value="10–15 years" className="dark:bg-gray-800">10–15 years</option>
                            <option value="15+ years" className="dark:bg-gray-800">15+ years</option>
                            <option value="15–20+ years" className="dark:bg-gray-800">15–20+ years</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:flex items-center whitespace-nowrap">
                            <MapPin className="h-3.5 w-3.5 mr-1" /> Location
                        </span>
                        <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="bg-appBg dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 text-sm rounded-xl focus:ring-1 focus:ring-primary-600 focus:border-primary-600 block px-4 py-2 cursor-pointer font-bold outline-none transition-all shadow-sm"
                        >
                            <option value="in" className="dark:bg-gray-800">India</option>
                            <option value="us" className="dark:bg-gray-800">United States</option>
                            <option value="gb" className="dark:bg-gray-800">United Kingdom</option>
                            <option value="ca" className="dark:bg-gray-800">Canada</option>
                            <option value="au" className="dark:bg-gray-800">Australia</option>
                            <option value="sg" className="dark:bg-gray-800">Singapore</option>
                        </select>
                    </div>

                    <button onClick={fetchTrends} className="p-2.5 bg-appBg dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary-600 border border-gray-100 dark:border-gray-700 rounded-xl transition-all shadow-sm" title="Refresh Trends">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-6">
                {/* Top Skills in Market */}
                <div className="shrink-0">
                    <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-start">
                        <BarChart3 className="h-3.5 w-3.5 mr-2 mt-0.5 text-primary-600 shrink-0" />
                        <span className="leading-tight">
                            Top Skills in Market for <span className="text-primary-600 mx-1">{domain}</span>
                        </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {trends.topSkills?.map((skill, i) => (
                            <span key={i} className="bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-500 px-4 py-2 rounded-full text-xs font-bold border border-green-100 dark:border-green-800/20">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Sample Jobs */}
                <div className="flex-1 flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-start">
                        <Briefcase className="h-3.5 w-3.5 mr-2 mt-0.5 text-primary-600 shrink-0" />
                        <span className="leading-tight">
                            Job Openings for <span className="text-primary-600 mx-1">{domain}</span>
                        </span>
                    </h4>
                    <div
                        className="space-y-3 overflow-y-auto pr-2 pb-4 h-[350px]"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {trends.sampleJobs?.map((job, i) => (
                            <a
                                key={i}
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-5 bg-appBg dark:bg-gray-800 border border-gray-100/50 dark:border-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-primary-100 dark:hover:border-primary-800 transition-all group shadow-sm hover:shadow-apple-hover"
                            >
                                <div className="flex justify-between items-start w-full gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-bold text-textPrimary dark:text-white text-sm group-hover:text-primary-600 transition-colors line-clamp-2 tracking-tight">{job.title}</h5>
                                        <div className="flex items-center mt-2 space-x-3">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">{job.company}</span>
                                            {job.location && (
                                                <span className="text-[10px] text-gray-400 flex items-center truncate">
                                                    <MapPin className="h-3 w-3 mr-0.5" />
                                                    {job.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-card dark:bg-gray-800 p-2 rounded-xl border border-gray-100/50 dark:border-gray-700 group-hover:bg-primary-600 group-hover:border-primary-600 transition-all shrink-0">
                                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-white" />
                                    </div>
                                </div>
                            </a>
                        ))}
                        {trends.sampleJobs?.length === 0 && (
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                                No specific job openings found for this role directly via API.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketTrends;
