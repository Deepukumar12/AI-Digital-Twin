import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, LogOut, Moon, Sun, Download, RefreshCw, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [darkMode, setDarkMode] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleRebuildTwin = async () => {
    setIsRebuilding(true);
    const toastId = toast.loading('Rebuilding Career Profiles & AI Roadmap...');
    try {
      await api.post('/career/rebuild');
      toast.success('Digital Twin Rebuilt Successfully!', { id: toastId });
      // Reload page to reflect new data from backend
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error('Failed to rebuild. ' + (err.response?.data?.message || err.message), { id: toastId });
    } finally {
      setIsRebuilding(false);
    }
  };

  const handleDownloadReport = () => {
    // Basic navigation or trigger print logic (since jsPDF takes some setup best left to a specific PDF component/function)
    toast.success('Preparing Report Download...');
    // A quick hack for clean PDF generation is native print styles
    window.print();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 md:ml-64 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand - Mobile Only now, as Sidebar has the brand */}
          <div className="flex md:hidden flex-shrink-0 items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-primary-600 rounded-lg p-1.5 shadow-sm">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
            </Link>
          </div>
          <div className="hidden md:flex flex-shrink-0 items-center">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">Welcome Back</span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {token ? (
              <>
                {/* Action Buttons */}
                <div className="flex items-center space-x-2 border-r border-gray-100 dark:border-gray-700 pr-4 mr-2">
                  <button
                    onClick={handleRebuildTwin}
                    disabled={isRebuilding}
                    title="Re-Run Assessment"
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <RefreshCw className={`h-5 w-5 ${isRebuilding ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    title="Download Report"
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>

                {/* Theme & Logout */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition-colors"
                  >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="ml-2 flex items-center bg-transparent text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    <LogOut className="h-4 w-4 mr-2 md:m-0" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-full transition-colors mr-2"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="ml-4 bg-gray-900 dark:bg-primary-600 text-white hover:bg-gray-800 dark:hover:bg-primary-700 px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
