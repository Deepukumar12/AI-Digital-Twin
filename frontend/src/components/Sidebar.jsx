import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../api/axios';
import {
    LayoutDashboard,
    UserCircle,
    BrainCircuit,
    TrendingUp,
    Briefcase,
    MessageSquare,
    Map,
    TestTube,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me');
                setUserName(res.data.name);
            } catch (err) {
                console.error("Failed to fetch user in sidebar", err);
            }
        };
        // Only fetch if we have a token
        if (localStorage.getItem('token')) {
            fetchUser();
        }
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Digital Twin Profile', path: '/profile', icon: <UserCircle size={20} /> },
        { name: 'Skill Intelligence', path: '/skills', icon: <BrainCircuit size={20} /> },
        { name: 'Career Prediction', path: '/prediction', icon: <TrendingUp size={20} /> },
        { name: 'Job Market Insights', path: '/market', icon: <Briefcase size={20} /> },
        { name: 'AI Career Coach', path: '/chat', icon: <MessageSquare size={20} /> },
        { name: 'Learning Roadmap', path: '/roadmap', icon: <Map size={20} /> },
        { name: 'Career Simulation', path: '/simulation', icon: <TestTube size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-sidebar text-gray-300 flex flex-col z-40 transition-transform md:translate-x-0 -translate-x-full">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="bg-primary-600 rounded-lg p-1.5 shadow-sm">
                        <BrainCircuit className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Digital Twin
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* User Mini Profile / Footer */}
            <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{userName || 'Loading...'}</p>
                    </div>
                </div>
                <div className="text-[10px] text-gray-500 text-center font-medium tracking-tight mt-1">
                    &copy; {new Date().getFullYear()} AI Digital Twin. All rights reserved.
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
