import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Import all sub-components
import WelcomeCard from '../components/dashboard/WelcomeCard';
import QuickStats from '../components/dashboard/QuickStats';
import CareerPrediction from '../components/dashboard/CareerPrediction';
import SkillAnalysis from '../components/dashboard/SkillAnalysis';
import SkillGap from '../components/dashboard/SkillGap';
import RoadmapPanel from '../components/dashboard/RoadmapPanel';
import AIActions from '../components/dashboard/AIActions';
import ExportSection from '../components/dashboard/ExportSection';
import PerformanceMetrics from '../components/dashboard/PerformanceMetrics';
import MarketTrends from '../components/dashboard/MarketTrends';

const Dashboard = () => {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const navigate = useNavigate();

  const [resourceQuery, setResourceQuery] = useState(null);
  const [resourceType, setResourceType] = useState('Learn');
  const [resourceData, setResourceData] = useState([]);
  const [isResourceLoading, setIsResourceLoading] = useState(false);

  const handleOpenResources = async (query, type = 'Learn') => {
    setResourceQuery(query);
    setResourceType(type);
    setIsResourceLoading(true);
    try {
      const res = await api.get(`/resources?skill=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`);
      setResourceData(res.data.resources || []);
    } catch (err) {
      toast.error(`Failed to locate ${type.toLowerCase()} resources`);
      setResourceData([]);
    } finally {
      setIsResourceLoading(false);
    }
  };

  const loadTwin = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await api.get('/twin');
      setTwin(response.data.twin);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 400) {
        navigate('/upload');
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadTwin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!twin) return null;

  // --- API Wrappers for Children --- //
  const handleUpdateTarget = async (role) => {
    try {
      if (!role) return;
      const res = await api.post('/target/update', { targetRole: role });
      await loadTwin(true); // refresh local state silently
      toast.success(res.data.message || `Target updated to ${role}`);
    } catch (err) {
      toast.error('Failed to update target');
      console.error(err);
    }
  };

  const handleAddSkill = async (name) => {
    setIsAddingSkill(true);
    try {
      await api.post('/skills/add', { skill: name, level: 'Intermediate' });
      await loadTwin(true);
      toast.success(`${name} added!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try {
      await api.post('/skills/remove', { skill: name });
      await loadTwin(true);
      toast.success(`Removed ${name}`);
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };

  const handleIgnoreSkill = async (name) => {
    toast.success(`Skill ${name} ignored (simulation)`);
    // Could add backend logic for ignored_skills if needed
  };

  const handleMarkAcquired = async (name) => {
    await handleAddSkill(name);
  };

  const toggleRoadmapTask = async (task, currentStatus) => {
    toast.success(`Marked ${task} as ${!currentStatus ? 'Completed' : 'Pending'}`);
  };

  // --- Data Transformations --- //
  const activeSkills = twin.technical_skills || [];
  const radarData = activeSkills.map(skill => ({
    subject: skill.name,
    A: skill.confidence || 50,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6 dark:bg-gray-900 min-h-screen pb-12">

      {/* 1. Header Array */}
      <WelcomeCard twin={twin} onUpdateTarget={handleUpdateTarget} />

      {/* 2. Top Stats */}
      <QuickStats twin={twin} activeSkillsCount={activeSkills.length} />

      {/* 3. Predictions and Advanced Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SkillAnalysis
          radarData={radarData}
          activeSkills={activeSkills}
          onAddSkill={handleAddSkill}
          isAddingSkill={isAddingSkill}
          onRemoveSkill={handleRemoveSkill}
        />
        <CareerPrediction twin={twin} onUpdateTarget={handleUpdateTarget} />
      </div>

      {/* 4. Gaps and Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <MarketTrends domain={(twin.target_role && twin.target_role !== 'Not Set') ? twin.target_role : twin.primary_domain} />
        <div>
          <RoadmapPanel twin={twin} onToggleTask={toggleRoadmapTask} onOpenResources={handleOpenResources} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SkillGap twin={twin} onIgnoreSkill={handleIgnoreSkill} onMarkAcquired={handleMarkAcquired} onOpenResources={handleOpenResources} />
        <div className="space-y-6">
          <PerformanceMetrics twin={twin} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AIActions />
            <ExportSection twin={twin} />
          </div>
        </div>
      </div>

      {/* Learning Resources Modal */}
      {resourceQuery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setResourceQuery(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 pr-6">
              {resourceType} Resources: <span className="text-primary-600 dark:text-primary-400 cursor-pointer">{resourceQuery}</span>
            </h3>

            {isResourceLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-500 text-sm animate-pulse">Searching for best resources...</p>
              </div>
            ) : (
              <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {resourceData.length > 0 ? resourceData.map((res, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl hover:border-primary-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 pr-4">{res.title}</h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{res.provider}</span>
                          <span className="text-xs text-gray-500">{res.type}</span>
                        </div>
                      </div>
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:text-primary-600 hover:border-primary-300 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">No specific resources found. Try an alternative manual search.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
