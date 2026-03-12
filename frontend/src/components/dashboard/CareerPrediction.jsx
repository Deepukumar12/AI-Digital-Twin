import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Info, ArrowRightLeft, GitCompare, X, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const CareerPrediction = ({ twin, onUpdateTarget }) => {
    const navigate = useNavigate();
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [targetDropdown, setTargetDropdown] = useState(twin?.target_role || '');
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
    const [scenarioInput, setScenarioInput] = useState('');
    const [simulationResult, setSimulationResult] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // Prepare data for the Bar Chart mapping predicted careers to their scores
    const careerScoresData = twin?.career_predictions
        ? Object.entries(twin.career_predictions)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => b.score - a.score)
        : [];

    // Prepare data for the Radar Chart mapping subjects to their self-assessment scores
    // Sort by score descending and limit to top 12 to prevent label overlap on the chart
    const skillRadarData = twin?.skill_assessments
        ? [...twin.skill_assessments]
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
            .map(item => ({
                subject: item.subject,
                A: item.score,
                fullMark: 100,
            }))
        : [];

    const commonRoles = [
        "Software Engineer", "Frontend Developer", "Backend Engineer",
        "Full Stack Developer", "Data Scientist", "DevOps Engineer",
        "Cloud Architect", "Product Manager"
    ];
    const handleSwitchTarget = () => {
        if (targetDropdown !== twin?.target_role) {
            onUpdateTarget(targetDropdown);
        }
    };

    const handleSimulate = async () => {
        if (!scenarioInput.trim()) {
            toast.error('Please enter a scenario');
            return;
        }
        setIsSimulating(true);
        setSimulationResult(null);
        try {
            const res = await api.post('/simulate', { scenario: scenarioInput });
            if (res.data?.prediction) {
                setSimulationResult(res.data.prediction);
            } else {
                setSimulationResult({ error: "Failed to parse simulation." });
            }
        } catch (err) {
            toast.error('Simulation engine offline or failed.');
            setSimulationResult({ error: "Failed to run simulation." });
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100/50 dark:border-gray-700 pb-4 gap-4">
                <h3 className="text-2xl font-bold text-textPrimary dark:text-white flex flex-wrap items-center gap-2 tracking-tight">
                    <Compass className="h-6 w-6 text-primary-600 shrink-0" />
                    <span className="whitespace-nowrap">Career Prediction</span>
                </h3>
                <button
                    onClick={() => setIsCompareOpen(true)}
                    className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors border border-primary-100 dark:border-primary-800/20 bg-primary-50 dark:bg-primary-900/10 px-4 py-2 rounded-xl"
                >
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare Roles
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mb-8">
                {/* Career Suitability Bar Chart */}
                <div className="bg-appBg dark:bg-gray-800 p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700 min-h-[350px]">
                    <h4 className="font-black text-gray-500 dark:text-gray-400 mb-6 flex items-center text-[10px] uppercase tracking-widest">
                        <BarChart2 className="h-3.5 w-3.5 mr-2 text-primary-600" /> Career Suitability Scores
                    </h4>

                    {careerScoresData.length > 0 ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={careerScoresData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.2} />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 'bold' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }}
                                        formatter={(value) => [`${value}% Match`, 'Suitability']}
                                    />
                                    <Bar dataKey="score" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <BarChart2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 tracking-tight">Complete your profile to unlock AI predictions.</p>
                            <button onClick={() => navigate('/upload')} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black shadow-stripe hover:bg-primary-700 transition uppercase tracking-widest">
                                Start Flow
                            </button>
                        </div>
                    )}
                </div>

                {/* Skill Strengths Radar Chart */}
                <div className="bg-appBg dark:bg-gray-800 p-6 rounded-2xl border border-gray-100/50 dark:border-gray-700 min-h-[350px]">
                    <h4 className="font-black text-gray-500 dark:text-gray-400 mb-6 flex items-center text-[10px] uppercase tracking-widest">
                        <Compass className="h-3.5 w-3.5 mr-2 text-primary-600" /> Subject Strengths
                    </h4>

                    {skillRadarData.length > 0 ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="55%" data={skillRadarData}>
                                    <PolarGrid stroke="#374151" opacity={0.3} />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
                                        tickFormatter={(value) => value.length > 14 ? `${value.substring(0, 12)}...` : value}
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Knowledge" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <Compass className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 tracking-tight">Assess your skills to generate the radar matrix.</p>
                            <button onClick={() => navigate('/upload')} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black shadow-stripe hover:bg-primary-700 transition uppercase tracking-widest">
                                Start Flow
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Target Switcher */}

                {/* Future Simulator */}
                <div className="md:col-span-2 bg-primary-50/30 dark:bg-primary-900/5 p-8 rounded-3xl border border-primary-100/50 dark:border-primary-800/10">
                    <h4 className="font-black text-gray-500 dark:text-gray-400 mb-3 flex items-center text-[10px] uppercase tracking-widest"><Compass className="h-3.5 w-3.5 mr-2 text-primary-600" /> Future Simulator</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 font-medium max-w-2xl leading-relaxed">See how acquiring new skills impacts your readiness.</p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <input
                            type="text"
                            placeholder="e.g., What if I learn Distributed Systems and Kubernetes?"
                            className="flex-1 min-w-0 bg-card dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3 text-sm text-textPrimary dark:text-white outline-none focus:ring-1 focus:ring-primary-600 transition-all font-bold shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
                            value={scenarioInput}
                            onChange={(e) => setScenarioInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
                        />
                        <button onClick={handleSimulate} disabled={isSimulating} className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-3 rounded-xl text-sm font-bold shadow-stripe transition-all disabled:opacity-50 min-w-[140px]">
                            {isSimulating ? 'Simulating...' : 'Run Simulation'}
                        </button>
                    </div>

                    {/* Simulation Result */}
                    {simulationResult && !simulationResult.error && (
                        <div className="mt-6 p-6 bg-card dark:bg-gray-800 rounded-2xl border border-gray-100/50 dark:border-gray-700 shadow-apple transition-all animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="font-bold text-textPrimary dark:text-white text-sm uppercase tracking-widest">Simulation Insight</h5>
                                <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 px-2 py-0.5 rounded-lg font-bold">READY</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-appBg dark:bg-gray-800 p-4 rounded-xl text-center border border-gray-100/50 dark:border-gray-700">
                                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Alignment Shift</p>
                                    <p className="text-xl font-black text-primary-600">{simulationResult.alignment_percentage || '+0%'}</p>
                                </div>
                                <div className="bg-appBg dark:bg-gray-800 p-4 rounded-xl text-center border border-gray-100/50 dark:border-gray-700">
                                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Estimated ROI</p>
                                    <p className="text-xl font-black text-green-600">{simulationResult.projected_salary_impact_percentage || '+0%'}</p>
                                </div>
                                <div className="bg-appBg dark:bg-gray-800 p-4 rounded-xl text-center border border-gray-100/50 dark:border-gray-700 flex flex-col justify-center">
                                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">Unlocked Roles</p>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {Array.isArray(simulationResult.new_roles_unlocked) ? simulationResult.new_roles_unlocked.join(', ') : 'None'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {simulationResult && simulationResult.error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-xl text-xs text-center font-bold border border-red-100 dark:border-red-800/30 uppercase tracking-widest">
                            {simulationResult.error}
                        </div>
                    )}
                </div>
            </div>



            {/* Compare Modal */}
            {isCompareOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl transform transition-all border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <GitCompare className="h-6 w-6 text-blue-500" />
                                Role Comparison Matrix
                            </h3>
                            <button onClick={() => setIsCompareOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="h-5 w-5" /></button>
                        </div>

                        <div className="overflow-x-auto mt-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-widest">
                                        <th className="p-4 border-b border-gray-100 dark:border-gray-700 font-black">Professional Role</th>
                                        <th className="p-4 border-b border-gray-100 dark:border-gray-700 font-black">Fit Compatibility</th>
                                        <th className="p-4 border-b border-gray-100 dark:border-gray-700 font-black">Critical Divergence</th>
                                        <th className="p-4 border-b border-gray-100 dark:border-gray-700 font-black text-center">Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {twin?.recommended_roles?.map((role, idx) => (
                                        <tr key={role} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="p-4 font-bold text-gray-900 dark:text-white text-sm">{role}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-900 dark:text-white text-xs">{Math.max(twin.alignment_percentage - (idx * 5) - 10, 30)}%</span>
                                                    <div className="w-20 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-primary-600 h-full rounded-full"
                                                            style={{ width: `${Math.max(twin.alignment_percentage - (idx * 5) - 10, 30)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300 text-xs italic font-medium">Domain Experience</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => { 
                                                        onUpdateTarget(role); 
                                                        setIsCompareOpen(false); 
                                                    }}
                                                    className="text-primary-600 font-bold text-xs hover:text-primary-700 transition-colors underline decoration-primary-600/30 underline-offset-4"
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!twin?.recommended_roles || twin.recommended_roles.length === 0) && (
                                        <tr><td colSpan="4" className="p-10 text-center text-gray-400 text-sm font-bold italic">No recommendations yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end mt-10">
                            <button onClick={() => setIsCompareOpen(false)} className="px-10 py-3 rounded-lg font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerPrediction;
