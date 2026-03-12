import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const DEFAULT_SUBJECTS = [
    { id: 'dsa', name: 'Data Structures & Algorithms', defaultVal: 50 },
    { id: 'js', name: 'JavaScript', defaultVal: 50 },
    { id: 'react', name: 'React', defaultVal: 50 },
    { id: 'node', name: 'Node.js', defaultVal: 50 },
    { id: 'db', name: 'Database', defaultVal: 50 },
    { id: 'sd', name: 'System Design', defaultVal: 50 },
    { id: 'py', name: 'Python', defaultVal: 50 },
    { id: 'ml', name: 'Machine Learning', defaultVal: 50 },
    { id: 'stat', name: 'Statistics', defaultVal: 50 }
];

const SkillSelfAssessment = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState({});
    const [assessmentSubjects, setAssessmentSubjects] = useState(DEFAULT_SUBJECTS);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchTwinData = async () => {
            try {
                const response = await api.get('/twin');
                const twin = response.data.twin;

                if (twin?.technical_skills && twin.technical_skills.length > 0) {
                    const dynamicSubjects = twin.technical_skills
                        .filter(skill => typeof skill === 'string' || (skill && typeof skill.name === 'string'))
                        .map(skill => {
                            const skillName = typeof skill === 'string' ? skill : skill.name;
                            return {
                                id: skillName.toLowerCase().replace(/\s+/g, '-'),
                                name: skillName,
                                defaultVal: 50
                            };
                        });

                    if (dynamicSubjects.length > 0) {
                        setAssessmentSubjects(dynamicSubjects);

                        const initialSkills = {};
                        dynamicSubjects.forEach(subject => {
                            initialSkills[subject.name] = subject.defaultVal;
                        });
                        setSkills(initialSkills);
                    } else {
                        // Fallback if all skills had invalid formats
                        setAssessmentSubjects(DEFAULT_SUBJECTS);
                        setSkills(DEFAULT_SUBJECTS.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.defaultVal }), {}));
                    }
                } else {
                    setAssessmentSubjects(DEFAULT_SUBJECTS);
                    setSkills(DEFAULT_SUBJECTS.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.defaultVal }), {}));
                }
            } catch (err) {
                console.error('Failed to fetch twin data for self-assessment:', err);
                setAssessmentSubjects(DEFAULT_SUBJECTS);
                setSkills(DEFAULT_SUBJECTS.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.defaultVal }), {}));
            } finally {
                setIsLoading(false);
            }
        };

        fetchTwinData();
    }, []);

    const handleSliderChange = (subject, value) => {
        setSkills(prev => ({
            ...prev,
            [subject]: parseInt(value, 10)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Format to array for backend
        const assessmentsArray = Object.entries(skills).map(([subject, score]) => ({
            subject,
            score
        }));

        try {
            const response = await api.post('/career/self-assessment', { assessments: assessmentsArray });

            toast.success('Assessment Complete!');
            setResult(response.data);

        } catch (error) {
            console.error('Failed to submit assessment:', error);
            toast.error('Failed to analyze your career path. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="max-w-4xl mx-auto mt-16 px-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-apple border border-gray-100 dark:border-gray-700 p-10 select-text text-center">

                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-50 dark:bg-green-900/20 text-green-600 mb-6 border border-green-100 dark:border-green-800/30 shadow-sm">
                        <CheckCircle className="w-10 h-10" />
                    </div>

                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
                        Analysis Complete
                    </h2>

                    <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30 p-8 rounded-2xl mb-8 max-w-2xl mx-auto">
                        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                            {result.message}
                        </p>
                    </div>

                    {result.prediction && result.prediction.missing_skills?.length > 0 && (
                        <div className="max-w-xl mx-auto bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-6 rounded-2xl mb-10 text-left">
                            <h4 className="flex items-center text-sm font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-3">
                                <AlertCircle className="w-4 h-4 mr-2" /> Focus Areas
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">To become fully ready, you should focus on improving:</p>
                            <div className="flex flex-wrap gap-2">
                                {result.prediction.missing_skills.map((skill, i) => (
                                    <span key={i} className="bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="h-14 px-12 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-700 shadow-stripe transition-all flex items-center justify-center mx-auto group"
                    >
                        Go to Priority Dashboard
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-16 px-4 pb-20">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-apple border border-gray-100 dark:border-gray-700 p-10">
                <div className="text-center mb-10 pb-10 border-b border-gray-100 dark:border-gray-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 mb-5 border border-primary-100 dark:border-primary-800/30 shadow-sm">
                        <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">Subject Knowledge Assessment</h2>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Rate your current knowledge in these core areas. Our AI prediction engine will use this to determine your best career path.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {assessmentSubjects.map((subject) => (
                        <div key={subject.name} className="flex flex-col md:flex-row md:items-center gap-4 group">
                            <label className="md:w-1/3 text-sm font-bold text-gray-700 dark:text-gray-300">
                                {subject.name}
                            </label>

                            <div className="md:w-2/3 flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-600"
                                    value={skills[subject.name] || 50}
                                    onChange={(e) => handleSliderChange(subject.name, e.target.value)}
                                />
                                <span className="w-12 text-right text-sm font-black text-primary-600 dark:text-primary-400 tracking-wider">
                                    {skills[subject.name] || 50}%
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="pt-8 mt-10 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black dark:hover:bg-gray-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <RefreshCw className="animate-spin h-5 w-5 mr-3" />
                                    Analyzing Profile...
                                </span>
                            ) : (
                                'Complete Assessment & Find Career'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SkillSelfAssessment;
