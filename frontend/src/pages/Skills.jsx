import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import SkillAnalysis from '../components/dashboard/SkillAnalysis';
import SkillGap from '../components/dashboard/SkillGap';

const Skills = () => {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [resourceQuery, setResourceQuery] = useState(null);
  const [resourceType, setResourceType] = useState('Learn');
  const [resourceData, setResourceData] = useState([]);
  const [isResourceLoading, setIsResourceLoading] = useState(false);

  const loadTwin = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await api.get('/twin');
      setTwin(response.data.twin);
    } catch (err) {
      console.error(err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadTwin();
  }, []);

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
  };

  const handleMarkAcquired = async (name) => {
    await handleAddSkill(name);
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
        Please upload a resume first to view your skill intelligence.
      </div>
    );
  }

  const activeSkills = twin.technical_skills || [];
  const radarData = activeSkills.map(skill => ({
    subject: skill.name,
    A: skill.confidence || 50,
    fullMark: 100,
  }));

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 flex items-center">
          <Layers className="h-8 w-8 text-primary-600 mr-4" />
          Skill Intelligence
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed font-medium">
          Analyze your current technical proficiencies and identify critical skill gaps preventing you from reaching your target role.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[650px] flex flex-col">
          <SkillAnalysis
            radarData={radarData}
            activeSkills={activeSkills}
            onAddSkill={handleAddSkill}
            isAddingSkill={isAddingSkill}
            onRemoveSkill={handleRemoveSkill}
          />
        </div>

        <div className="flex flex-col h-[650px] overflow-y-auto pr-2 rounded-3xl" style={{ scrollbarWidth: 'thin' }}>
          <SkillGap
            twin={twin}
            onIgnoreSkill={handleIgnoreSkill}
            onMarkAcquired={handleMarkAcquired}
            onOpenResources={handleOpenResources}
          />
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

export default Skills;
