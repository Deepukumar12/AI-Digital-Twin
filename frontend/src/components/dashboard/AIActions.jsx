import React, { useState } from 'react';
import { MessageSquare, RefreshCw, PlayCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const AIActions = () => {
    const navigate = useNavigate();

    // Simulate Future Modal State
    const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
    const [simulationInput, setSimulationInput] = useState('');
    const [simulationResult, setSimulationResult] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [isRebuilding, setIsRebuilding] = useState(false);

    const handleRebuildTwin = async () => {
        setIsRebuilding(true);
        const toastId = toast.loading('Rebuilding Career Profiles & AI Roadmap...');
        try {
            await api.post('/career/rebuild');
            toast.success('Digital Twin Rebuilt Successfully!', { id: toastId });
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            toast.error('Failed to rebuild. ' + (err.response?.data?.message || err.message), { id: toastId });
        } finally {
            setIsRebuilding(false);
        }
    };

    const handleSimulate = async () => {
        if (!simulationInput.trim()) return;
        setIsSimulating(true);
        try {
            const res = await api.post('/simulate', { scenario: simulationInput });
            setSimulationResult(res.data.prediction);
        } catch (err) {
            toast.error('Simulation engine failed');
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 h-full flex flex-col justify-between">
            <div>
                <h3 className="text-3xl font-bold text-textPrimary dark:text-white mb-2 tracking-tight">AI Actions</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide mb-8">Interact with your digital twin through AI-powered actions.</p>
            </div>

            <div className="space-y-4">
                <button onClick={() => navigate('/chat')} className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-lg flex items-center justify-between transition-all border border-gray-100 dark:border-gray-700 shadow-sm group">
                    <span className="flex items-center"><MessageSquare className="h-5 w-5 mr-4 text-primary-600 dark:text-primary-400" /> Ask AI Mentor</span>
                    <span className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 group-hover:translate-x-1 transition-all">→</span>
                </button>

                <button
                    onClick={() => setIsSimulateModalOpen(true)}
                    className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-lg flex items-center justify-between transition-all border border-gray-100 dark:border-gray-700 shadow-sm group"
                >
                    <span className="flex items-center"><PlayCircle className="h-5 w-5 mr-4 text-primary-600 dark:text-primary-400" /> Simulate Scenario</span>
                    <span className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 group-hover:translate-x-1 transition-all">→</span>
                </button>

                <button
                    onClick={handleRebuildTwin}
                    disabled={isRebuilding}
                    className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-lg flex items-center justify-between transition-all border border-gray-100 dark:border-gray-700 shadow-sm group disabled:opacity-50"
                >
                    <span className="flex items-center">
                        <RefreshCw className={`h-5 w-5 mr-4 text-purple-600 dark:text-purple-400 ${isRebuilding ? 'animate-spin' : ''}`} />
                        Rebuild Twin
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 group-hover:text-purple-600 group-hover:translate-x-1 transition-all">→</span>
                </button>
            </div>

            {/* Simulator Modal */}
            {isSimulateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl transform transition-all flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center tracking-tight">
                                <PlayCircle className="h-6 w-6 mr-3 text-primary-600 dark:text-primary-400" /> Scenario Simulator
                            </h3>
                            <button onClick={() => setIsSimulateModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="h-5 w-5" /></button>
                        </div>

                        <div className="bg-primary-50 dark:bg-primary-900/10 p-5 rounded-lg mb-8 border border-primary-100 dark:border-primary-800/20">
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">
                                Enter a scenario (e.g., "What if I learn Python?") to see how it affects your career.
                            </p>
                        </div>

                        <div className="flex space-x-3 mb-8">
                            <input
                                type="text"
                                value={simulationInput}
                                onChange={e => setSimulationInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSimulate()}
                                disabled={isSimulating}
                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-5 py-4 text-sm text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-primary-600 transition-all font-bold shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Scenario pivot..."
                            />
                            <button
                                onClick={handleSimulate}
                                disabled={isSimulating || !simulationInput}
                                className="px-8 py-4 rounded-lg font-black bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-sm disabled:opacity-50 uppercase tracking-widest text-[11px]"
                            >
                                {isSimulating ? 'Processing...' : 'Simulate'}
                            </button>
                        </div>

                        {simulationResult && (
                            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-inner">
                                <h4 className="font-black text-gray-500 dark:text-gray-400 mb-4 text-[10px] uppercase tracking-widest">AI Output</h4>
                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed text-sm font-medium">
                                    {simulationResult}
                                </p>
                            </div>
                        )}
                        <button onClick={() => setIsSimulateModalOpen(false)} className="mt-8 w-full py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-600 shadow-sm">Close Simulator</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIActions;
