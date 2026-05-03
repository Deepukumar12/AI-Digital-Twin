import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-appBg dark:bg-gray-900 font-sans antialiased text-textPrimary dark:text-gray-100 transition-colors">
        <Toaster position="top-right" reverseOrder={false} toastOptions={{ className: 'dark:bg-gray-800 dark:text-white' }} />
        
        {/* Simple Navbar for Admin */}
        <nav className="bg-apple-card border-b border-apple-divider px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-apple-text-primary tracking-tight">AI Digital Twin Admin</span>
          </div>
          {localStorage.getItem('token') && (
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          )}
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
