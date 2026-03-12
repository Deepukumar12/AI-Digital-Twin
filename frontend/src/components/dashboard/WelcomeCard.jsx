import React, { useState } from 'react';
import { Target, Edit3, X, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeCard = ({ twin, onUpdateTarget }) => {
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [targetInput, setTargetInput] = useState(twin?.target_role || twin?.primary_domain || '');
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSave = () => {
        onUpdateTarget(targetInput);
        setIsTargetModalOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700">
            <div className="flex-1">
                <h1 className="text-4xl font-bold text-textPrimary dark:text-white mb-1 tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Access your AI Digital Twin</p>

                {/* Micro-actions */}
                <div className="flex flex-wrap gap-4 mt-6">
                    <button onClick={() => navigate('/profile')} className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-all uppercase tracking-widest">Update Profile</button>
                    <span className="text-gray-200 dark:text-gray-700 hidden sm:block">|</span>
                    <button onClick={() => setIsSummaryModalOpen(true)} className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-all uppercase tracking-widest">Twin Summary</button>
                    <span className="text-gray-200 dark:text-gray-700 hidden sm:block">|</span>
                    <button onClick={() => setIsTargetModalOpen(true)} className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-all uppercase tracking-widest">Change Goal</button>
                </div>
            </div>

            <div className="mt-8 md:mt-0 flex items-center shrink-0">
                <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/20 px-6 py-4 rounded-2xl flex items-center shadow-sm">
                    <div className="bg-primary-100 dark:bg-primary-800/30 p-2.5 rounded-xl mr-4">
                        <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest">Target Role</span>
                        <div className="flex items-center">
                            <span className="text-textPrimary dark:text-white font-bold tracking-tight">{twin?.target_role || twin?.primary_domain || 'Unknown'}</span>
                            <button onClick={() => setIsTargetModalOpen(true)} className="ml-3 text-gray-400 hover:text-primary-600 transition-all">
                                <Edit3 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Modal */}
            {isTargetModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-all border border-gray-100/50 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-textPrimary dark:text-white tracking-tight">Set Target Role</h3>
                            <button onClick={() => setIsTargetModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium leading-relaxed">Changing your target role will update your career scores.</p>
                        <input
                            type="text"
                            value={targetInput}
                            onChange={e => setTargetInput(e.target.value)}
                            className="w-full border border-gray-200 dark:border-gray-600 bg-appBg dark:bg-gray-800 text-textPrimary dark:text-white rounded-xl px-5 py-4 mb-8 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="e.g. Senior DevOps Engineer"
                        />
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setIsTargetModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-3 rounded-xl font-black bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-stripe uppercase tracking-widest text-[10px]">Update Goal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Modal */}
            {isSummaryModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card dark:bg-gray-800 rounded-3xl w-full max-w-2xl p-8 shadow-2xl transform transition-all border border-gray-100/50 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-textPrimary dark:text-white flex items-center gap-3 tracking-tight">
                                <UserCheck className="h-7 w-7 text-primary-600" />
                                Digital Twin Profile Summary
                            </h3>
                            <button onClick={() => setIsSummaryModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">{twin?.profile_summary || 'No summary generated yet.'}</p>

                            {twin?.recommended_roles?.length > 0 && (
                                <div className="mt-8 p-6 bg-appBg dark:bg-gray-800 rounded-2xl border border-gray-100/50 dark:border-gray-700">
                                    <h4 className="text-[10px] uppercase font-black text-gray-500 dark:text-gray-400 tracking-widest mb-4">Recommended Trajectories</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {twin.recommended_roles.map((r, i) => (
                                            <span key={i} className="bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800/20 shadow-sm">{r}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end mt-8">
                            <button onClick={() => setIsSummaryModalOpen(false)} className="px-8 py-3 rounded-xl font-black bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-stripe uppercase tracking-widest text-[10px]">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomeCard;
