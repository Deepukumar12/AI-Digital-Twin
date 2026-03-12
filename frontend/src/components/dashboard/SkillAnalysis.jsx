import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillAnalysis = ({ radarData, activeSkills, onAddSkill, isAddingSkill, onRemoveSkill }) => {
    const [newSkillName, setNewSkillName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newSkillName) {
            onAddSkill(newSkillName);
            setNewSkillName('');
        }
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 flex flex-col h-full overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin' }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-2xl font-bold text-textPrimary dark:text-white tracking-tight">Skill Analysis</h3>
                <div className="flex space-x-2 w-full sm:w-auto">
                    <button onClick={() => navigate('/upload')} className="w-full sm:w-auto justify-center text-xs bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl flex items-center font-bold hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-colors border border-primary-100 dark:border-primary-800/20">
                        <UploadCloud className="h-4 w-4 mr-2" /> Extract From Resume
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex space-x-2 mb-8">
                <input
                    type="text"
                    placeholder="Add a skill manually..."
                    className="flex-1 text-sm border border-gray-200 dark:border-gray-600 bg-appBg dark:bg-gray-800 text-textPrimary dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary-600 transition-all font-bold shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    disabled={isAddingSkill}
                />
                <button type="submit" disabled={isAddingSkill || !newSkillName} className="bg-primary-600 text-white disabled:opacity-50 px-6 py-3 rounded-xl hover:bg-primary-700 transition-all flex items-center justify-center font-bold shadow-stripe">
                    <Plus className="h-5 w-5 mr-1" /> Add
                </button>
            </form>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#9ca3af" opacity={0.3} />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 700 }}
                            tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 10)}...` : value}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Proficiency" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '16px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', fontSize: '11px', fontWeight: 'bold' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Active Skills Pills */}
            <div className="mt-8 flex flex-wrap gap-2">
                {activeSkills.map((s, i) => (
                    <div key={i} className="group flex items-center bg-appBg dark:bg-gray-800 border border-gray-100/50 dark:border-gray-700 px-5 py-2.5 rounded-full text-xs font-black text-gray-600 dark:text-gray-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 dark:hover:border-red-800/20 hover:text-red-600 shadow-sm">
                        {s.name}
                        <button onClick={() => onRemoveSkill(s.name)} className="ml-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                {activeSkills.length === 0 && <span className="text-sm text-gray-400 font-bold italic">No skills added yet. Add some above!</span>}
            </div>
        </div>
    );
};

export default SkillAnalysis;
