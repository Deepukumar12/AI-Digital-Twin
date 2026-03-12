import React from 'react';
import { Target, CheckCircle, Clock, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RoadmapPanel = ({ twin, onToggleTask, onOpenResources }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 flex flex-col h-full lg:row-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-textPrimary dark:text-white flex items-center tracking-tight">
                    <Target className="h-6 w-6 mr-3 text-green-500" /> Career Roadmap
                </h3>
                <button onClick={() => navigate('/roadmap')} className="text-xs text-primary-600 hover:text-primary-700 font-bold transition-all underline decoration-primary-600/30 underline-offset-4">View Full Roadmap</button>
            </div>

            {(!twin?.roadmap || twin.roadmap.length === 0) ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-appBg dark:bg-gray-800">
                    <Target className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3 opacity-50" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-bold italic">No roadmap tasks yet.</p>
                    <button onClick={() => toast.error('Rebuild Twin to generate roadmap')} className="mt-6 text-primary-600 dark:text-primary-400 text-sm font-black uppercase tracking-widest hover:text-primary-700 transition-all">
                        Generate Roadmap
                    </button>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl mb-6 flex items-start border border-primary-100 dark:border-primary-800/20">
                        <Settings2 className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Click on tasks to mark them as completed.</p>
                    </div>
                    {twin.roadmap.map((item, idx) => (
                        <div key={idx} onClick={() => onToggleTask(item.task, item.completed)} className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${item.completed ? 'bg-appBg dark:bg-gray-800/50 border-gray-100/50 dark:border-gray-700 opacity-60' : 'bg-card dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-800 active:scale-[0.98]'}`}>
                            <div className="flex items-start">
                                <div className={`mt-0.5 mr-4 flex-shrink-0 ${item.completed ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                                    {item.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold tracking-tight ${item.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-textPrimary dark:text-white'}`}>
                                        {item.task}
                                    </p>
                                    <div className="flex space-x-2 mt-3">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-gray-500 dark:text-gray-400 bg-appBg dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100/50 dark:border-gray-700 shadow-sm">
                                            {item.type}
                                        </span>
                                        {!item.completed && (
                                            <span onClick={(e) => { e.stopPropagation(); onOpenResources(item.task, item.type || 'Learn'); }} className="text-[9px] uppercase tracking-widest font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md border border-primary-100 dark:border-primary-800/20 shadow-sm hover:bg-primary-600 hover:text-white transition-all">
                                                {item.type === 'Build' ? 'Build' : item.type === 'Apply' ? 'Apply' : 'Learn'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoadmapPanel;
