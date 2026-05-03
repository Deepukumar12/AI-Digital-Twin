import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import heroImage from '../assets/landing-hero.png';

const Landing = () => {
  const token = localStorage.getItem('token');

  // If already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left z-10">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              Your Career, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Digitally Replicated.
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Sync your professional identity with our AI Twin engine. Get deep career insights, skill gap analysis, and real-time market predictions to stay ahead of the curve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center"
              >
                Get Started Free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold text-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" />
                  </div>
                ))}
              </div>
              <p>Joined by 2,000+ professionals this month</p>
            </div>
          </div>
          <div className="relative lg:block hidden">
            <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-3xl opacity-20 transform -rotate-6"></div>
            <img
              src={heroImage}
              alt="AI Digital Twin Hero"
              className="relative rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">Master Your Professional Future</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Integrated tools for the modern high-performance career.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<SparklesIcon />}
              title="AI Resume Extraction"
              description="Transform static PDFs into dynamic data streams. Our engine extracts nested skills and experience automatically."
            />
            <FeatureCard
              icon={<TwinIcon />}
              title="Digital Twin Sync"
              description="Create a live-updating replica of your professional self. Track alignment with target roles in real-time."
            />
            <FeatureCard
              icon={<TrendIcon />}
              title="Market Intelligence"
              description="Real-time data from Adzuna and LinkedIn. Know the demand for your skills before you search for a job."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-8">Empowering professionals from</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            <LogoPlaceholder name="Google" />
            <LogoPlaceholder name="Meta" />
            <LogoPlaceholder name="Amazon" />
            <LogoPlaceholder name="Microsoft" />
            <LogoPlaceholder name="Netflix" />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 lg:p-20 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">Ready to Build Your Digital Twin?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Stop guessing your career path. Let AI show you the gaps and the shortcuts to your dream role.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl transition-all hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1"
          >
            Create My Twin Now
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-blue-500/10 blur-[150px] -z-10"></div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold dark:text-white">AI Twin</span>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 text-sm">© 2026 AI Digital Twin. Built for high-performers.</p>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const LogoPlaceholder = ({ name }) => (
  <span className="text-2xl font-bold text-gray-500">{name}</span>
);

const SparklesIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TwinIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TrendIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default Landing;
