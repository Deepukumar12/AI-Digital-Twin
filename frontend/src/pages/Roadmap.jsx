import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Roadmap = () => {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resourceQuery, setResourceQuery] = useState(null);
  const [resourceType, setResourceType] = useState('Learn');
  const [resourceData, setResourceData] = useState([]);
  const [isResourceLoading, setIsResourceLoading] = useState(false);
  const navigate = useNavigate();

  const loadTwin = async () => {
    try {
      const res = await api.post('/career/rebuild'); // Get fresh roadmap
      setTwin(res.data.twin);
    } catch (err) {
      toast.error("Failed to load roadmap data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTwin();
  }, []);

  const handleToggle = async (task, current) => {
    toast.success("Task status updated (Simulation)");
    // In a real env, we'd hit /roadmap/update
  };

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

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-10 border-b border-apple-divider pb-6">
        <div>
          <h1 className="text-3xl font-bold text-apple-text-primary dark:text-white flex items-center tracking-tight">
            <Map className="mr-4 h-8 w-8 text-apple-blue shrink-0" /> Career Growth Roadmap
          </h1>
          <p className="text-apple-text-secondary dark:text-gray-400 mt-2 font-medium">AI-optimized milestones to reach {twin?.target_role}</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-apple-blue hover:text-apple-blue-active border border-apple-blue/20 bg-apple-blue/5 px-4 py-2 rounded-apple-sm transition-all shadow-sm">Back to Dashboard</button>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-apple-divider before:to-transparent">
        {twin?.roadmap?.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border border-white dark:border-gray-800 shadow-apple-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-300 z-10 ${item.completed ? 'bg-apple-status-green scale-110 shadow-lg' : 'bg-apple-bg dark:bg-gray-800 group-hover:bg-apple-hover-bg dark:group-hover:bg-gray-700'}`}>
              {item.completed ? <CheckCircle2 className="h-6 w-6 text-white" /> : <Clock className="h-5 w-5 text-apple-text-muted dark:text-gray-400" />}
            </div>
            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-apple-card border border-apple-divider dark:border-gray-700 bg-apple-card dark:bg-gray-800 shadow-apple-card transition-all hover:-translate-y-1 hover:shadow-apple-elevated">
              <div className="flex items-center justify-between space-x-2 mb-3">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-apple-sm ${item.priority === 'High' ? 'bg-apple-status-red/10 text-apple-status-red border border-apple-status-red/10' : 'bg-apple-blue/5 text-apple-blue border border-apple-blue/10'}`}>
                  {item.priority || 'Medium'}
                </span>
                <div className="flex items-center space-x-3">
                  {!item.completed && (
                    <button
                      onClick={() => handleOpenResources(item.task, item.type || 'Learn')}
                      className="text-[10px] uppercase tracking-widest font-black text-apple-blue bg-apple-blue/10 px-3 py-1.5 rounded-apple-sm border border-apple-blue/20 shadow-sm hover:bg-apple-blue hover:text-white transition-all transform active:scale-95"
                    >
                      {item.type === 'Build' ? 'Build' : item.type === 'Apply' ? 'Apply' : 'Learn'}
                    </button>
                  )}
                  <button onClick={() => handleToggle(item.task, item.completed)} className="text-apple-text-muted hover:text-apple-blue transition-all transform active:scale-110">
                    {item.completed ? <CheckCircle2 className="h-5 w-5 text-apple-status-green" /> : <Circle className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <p className="font-bold text-apple-text-primary dark:text-white leading-relaxed text-sm mt-3">{item.task}</p>
            </div>
          </div>
        ))}

        {!twin?.roadmap?.length && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500">No roadmap tasks generated. Go to Dashboard and click Rebuild Twin!</p>
          </div>
        )}
      </div>

      <div className="mt-16 p-10 bg-apple-blue rounded-apple-card text-white shadow-apple-elevated flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="mb-6 md:mb-0 relative z-10">
          <h3 className="text-2xl font-bold tracking-tight">Ready to take the next step?</h3>
          <p className="text-apple-blue-active mt-2 italic font-medium opacity-80">"The best way to predict the future is to create it."</p>
        </div>
        <button onClick={() => navigate('/chat')} className="bg-white text-apple-blue px-8 py-4 rounded-apple-sm font-black hover:bg-apple-bg transition-all flex items-center shadow-lg transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs relative z-10">
          Discuss with Mentor <ChevronRight className="ml-2 h-5 w-5" />
        </button>
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

export default Roadmap;
