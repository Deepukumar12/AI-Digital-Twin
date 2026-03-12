import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const PerformanceMetrics = ({ twin }) => {
  const barData = [
    { name: 'Alignment', score: twin?.alignment_percentage || 0 },
    { name: 'Readiness', score: twin?.career_readiness_score || 0 },
    { name: 'Strength', score: twin?.skill_strength_score || 0 }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center tracking-tight">
        <Activity className="h-6 w-6 mr-3 text-purple-600" /> Performance Metrics
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 700 }} width={80} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', fontSize: '11px', fontWeight: 'bold' }} />
            <Bar dataKey="score" fill="#7c3aed" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
