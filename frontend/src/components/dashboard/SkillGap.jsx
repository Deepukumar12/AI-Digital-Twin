import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ExternalLink, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';

const SkillGap = ({ twin, onMarkAcquired, onIgnoreSkill, onOpenResources }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700" id="skill-gap">
            <h3 className="text-2xl font-bold text-textPrimary dark:text-white mb-8 flex items-center tracking-tight">
                <AlertTriangle className="mr-3 h-6 w-6 text-red-600" /> Skill Gap Analysis
            </h3>

            <div className="space-y-4">
                {twin?.weaknesses?.length > 0 ? twin.weaknesses.map((w, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-appBg dark:bg-gray-800 border border-gray-100/50 dark:border-gray-700 hover:shadow-sm transition-all">
                        <span className="text-sm font-bold text-textPrimary dark:text-white mb-3 sm:mb-0 tracking-tight">{w}</span>
                        <div className="flex flex-wrap gap-2">
                            {/* Learn Now */}
                            <button onClick={() => onOpenResources(w)} className="text-[10px] px-3 py-2 rounded-lg bg-card dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm border border-gray-200 dark:border-gray-600 flex items-center font-black uppercase tracking-widest">
                                <ExternalLink className="h-3 w-3 mr-1.5" /> Learn More
                            </button>
                            {/* Mark Acquired */}
                            <button
                                onClick={() => {
                                    toast.promise(onMarkAcquired(w), {
                                        loading: 'Updating skill...',
                                        success: `Profile updated: ${w} acquired!`,
                                        error: 'Sync failed'
                                    });
                                }}
                                className="text-[10px] px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center font-black uppercase tracking-widest border border-green-100 dark:border-green-800/20"
                            >
                                <CheckCircle className="h-3 w-3 mr-1.5" /> Mark Acquired
                            </button>
                            {/* Ignore Skill */}
                            <button onClick={() => onIgnoreSkill(w)} className="text-[10px] px-3 py-2 rounded-lg bg-card dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm border border-gray-200 dark:border-gray-600 flex items-center font-black uppercase tracking-widest">
                                <ShieldOff className="h-3 w-3 mr-1.5" /> Ignore
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-appBg dark:bg-gray-800">
                        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3 opacity-50" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold italic tracking-tight">You have no significant skill gaps!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillGap;
