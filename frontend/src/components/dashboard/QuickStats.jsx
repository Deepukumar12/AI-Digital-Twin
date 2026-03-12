import React, { useState } from 'react';
import { Target, TrendingUp, Zap, AlertCircle, Map, Layers, X, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickStats = ({ twin, activeSkillsCount }) => {
    const navigate = useNavigate();
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stat 1: Overall Readiness */}
                <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 flex flex-col justify-center transition-all hover:shadow-apple-hover hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Readiness</p>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl shadow-sm"><Target className="h-5 w-5 text-green-600 dark:text-green-500" /></div>
                    </div>
                    <p className="text-4xl font-bold text-textPrimary dark:text-white mb-3 tracking-tighter">{twin?.career_readiness_score || 0}%</p>
                    <div className="flex justify-between mt-auto">
                        <button onClick={() => navigate('/roadmap')} className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center transition-colors"><Map className="h-3.5 w-3.5 mr-1.5" /> View Roadmap</button>
                    </div>
                </div>

                {/* Stat 2: Career Match */}
                <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 flex flex-col justify-center transition-all hover:shadow-apple-hover hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Alignment</p>
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl shadow-sm"><TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" /></div>
                    </div>
                    <p className="text-4xl font-bold text-textPrimary dark:text-white mb-3 tracking-tighter">{twin?.alignment_percentage || 0}%</p>
                    <div className="flex mt-auto">
                        <button onClick={() => setIsMatchModalOpen(true)} className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center transition-colors"><BarChart className="h-3.5 w-3.5 mr-1.5" /> Breakdown</button>
                    </div>
                </div>

                {/* Stat 3: Active Skills */}
                <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 flex flex-col justify-center transition-all hover:shadow-apple-hover hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Skills</p>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl shadow-sm"><Zap className="h-5 w-5 text-orange-600 dark:text-orange-500" /></div>
                    </div>
                    <p className="text-4xl font-bold text-textPrimary dark:text-white mb-3 tracking-tighter">{activeSkillsCount}</p>
                    <div className="flex mt-auto">
                        <button onClick={() => navigate('/skills')} className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center transition-colors"><Layers className="h-3.5 w-3.5 mr-1.5" /> View Matrix</button>
                    </div>
                </div>

                {/* Stat 4: Missing Skills */}
                <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 flex flex-col justify-center transition-all hover:shadow-apple-hover hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Missing Skills</p>
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm"><AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" /></div>
                    </div>
                    <p className="text-4xl font-bold text-textPrimary dark:text-white mb-3 tracking-tighter">{twin?.weaknesses?.length || 0}</p>
                    <div className="flex mt-auto">
                        <a href="#skill-gap" className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center transition-colors">Analyze Gaps ↓</a>
                    </div>
                </div>
            </div>

            {isMatchModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card dark:bg-gray-800 rounded-3xl w-full max-w-sm p-8 shadow-2xl transform transition-all border border-gray-100/50 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100/50 dark:border-gray-700 pb-4">
                            <h3 className="text-xl font-bold text-textPrimary dark:text-white flex items-center tracking-tight"><TrendingUp className="mr-2 h-5 w-5 text-primary-600" /> Compatibility</h3>
                            <button onClick={() => setIsMatchModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest">Alignment</span>
                                <span className="font-bold text-textPrimary dark:text-white">{twin?.alignment_percentage || 0}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest">Strength</span>
                                <span className="font-bold text-textPrimary dark:text-white">{twin?.skill_strength_score || 0}/100</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest">Confidence</span>
                                <span className="font-bold text-textPrimary dark:text-white">{twin?.twin_confidence_index || 0}%</span>
                            </div>
                        </div>
                        <button onClick={() => setIsMatchModalOpen(false)} className="w-full mt-10 px-4 py-3 bg-appBg dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 shadow-sm">Dismiss</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickStats;
