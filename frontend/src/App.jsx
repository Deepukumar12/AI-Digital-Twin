import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SkillSelfAssessment from './pages/SkillSelfAssessment';
import UploadResume from './pages/UploadResume';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Skills from './pages/Skills';
import Roadmap from './pages/Roadmap';
import Prediction from './pages/Prediction';
import Market from './pages/Market';
import Simulation from './pages/Simulation';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const token = localStorage.getItem('token');
  const showSidebar = !isAuthRoute && token;

  return (
    <div className="min-h-screen bg-appBg dark:bg-gray-900 flex flex-col font-sans antialiased text-textPrimary dark:text-gray-100 transition-colors">
      {showSidebar && <Sidebar />}
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
      <main className={`flex-1 transition-all ${showSidebar ? 'md:ml-64' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/self-assessment" element={<PrivateRoute><SkillSelfAssessment /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><UploadResume /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/skills" element={<PrivateRoute><Skills /></PrivateRoute>} />
            <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
            <Route path="/prediction" element={<PrivateRoute><Prediction /></PrivateRoute>} />
            <Route path="/market" element={<PrivateRoute><Market /></PrivateRoute>} />
            <Route path="/simulation" element={<PrivateRoute><Simulation /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
