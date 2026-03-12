import React, { useState, useEffect } from 'react';
import { PlayCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Simulation = () => {
    const [twin, setTwin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [simulationInput, setSimulationInput] = useState('');
    const [simulationResult, setSimulationResult] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await api.get('/twin');
                setTwin(response.data.twin);
            } catch (err) {
                console.error("Simulation page failed to load twin data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSimulate = async () => {
        if (!simulationInput.trim()) return;
        setIsSimulating(true);
        try {
            const res = await api.post('/simulate', { scenario: simulationInput });
            const result = res.data.prediction;
            setSimulationResult(result);
            setHistory([{ query: simulationInput, result }, ...history]);
            setSimulationInput('');
        } catch (err) {
            toast.error('Simulation engine failed');
        } finally {
            setIsSimulating(false);
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
                Please upload a resume first to create your Digital Twin to run simulations.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 flex items-center">
                    <PlayCircle className="h-8 w-8 text-primary-600 mr-4" />
                    Career Simulation Lab
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed font-medium">
                    Test different career moves, skill acquisitions, or role changes. Your Digital Twin will predict the outcome and viability based on real-time market data.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                <div className="bg-primary-50 dark:bg-primary-900/10 p-5 rounded-2xl mb-8 border border-primary-100 dark:border-primary-800/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-bold italic">
                        Example: "What happens if I learn Python and apply for a Data Science role?"
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    <input
                        type="text"
                        value={simulationInput}
                        onChange={e => setSimulationInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSimulate()}
                        disabled={isSimulating}
                        className="flex-1 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-5 text-base text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold shadow-sm"
                        placeholder="Type your scenario pivot here..."
                    />
                    <button
                        onClick={handleSimulate}
                        disabled={isSimulating || !simulationInput}
                        className="px-10 py-5 rounded-2xl font-black bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-sm disabled:opacity-50 uppercase tracking-widest text-sm"
                    >
                        {isSimulating ? 'Processing Scenario...' : 'Run Simulation'}
                    </button>
                </div>
            </div>

            {simulationResult && (
                <div className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 border border-primary-100 dark:border-gray-700 shadow-apple mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary-600"></div>
                    <div className="flex justify-between items-start mb-6">
                        <h4 className="font-black text-primary-600 dark:text-primary-400 text-sm uppercase tracking-widest mb-1">Latest Prediction Output</h4>
                        <button onClick={() => setSimulationResult('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-loose text-base font-medium">
                        {typeof simulationResult === 'string' ? simulationResult : (simulationResult.prediction_text || simulationResult.prediction || "Simulation completed successfully.")}
                    </p>
                </div>
            )}

            {history.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Simulation History</h2>
                    <div className="space-y-6">
                        {history.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <span className="bg-gray-200 dark:bg-gray-700 w-2 h-2 rounded-full mr-3"></span>
                                    You asked: <span className="text-primary-600 ml-2">"{item.query}"</span>
                                </h4>
                                <div className="pl-5 border-l-2 border-gray-200 dark:border-gray-600 ml-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap mt-2 line-clamp-3">
                                        {typeof item.result === 'string' ? item.result : (item.result.prediction_text || item.result.prediction || "Historical simulation result")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Simulation;
