import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, Mail } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      navigate('/dashboard'); // Will likely be empty, suggest redirecting to upload later
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-apple-bg/50 px-4">
      <div className="max-w-md w-full bg-apple-card rounded-apple-card shadow-apple-card border border-apple-divider p-10 transform transition-all duration-300">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-apple-text-primary tracking-tight">Create an Account</h2>
          <p className="mt-2 text-sm text-apple-text-secondary font-medium">Start building your Career Digital Twin</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-apple-text-muted uppercase tracking-widest mb-2 pl-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-apple-blue">
                <Mail className="h-5 w-5 text-apple-text-muted" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-12 pr-4 py-3.5 bg-apple-bg border border-apple-divider rounded-apple-sm text-apple-text-primary text-sm font-bold shadow-sm outline-none focus:ring-1 focus:ring-apple-blue transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-apple-text-muted uppercase tracking-widest mb-2 pl-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-apple-blue">
                <Lock className="h-5 w-5 text-apple-text-muted" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-12 pr-4 py-3.5 bg-apple-bg border border-apple-divider rounded-apple-sm text-apple-text-primary text-sm font-bold shadow-sm outline-none focus:ring-1 focus:ring-apple-blue transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-apple-text-muted uppercase tracking-widest mb-2 pl-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-apple-blue">
                <Lock className="h-5 w-5 text-apple-text-muted" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-12 pr-4 py-3.5 bg-apple-bg border border-apple-divider rounded-apple-sm text-apple-text-primary text-sm font-bold shadow-sm outline-none focus:ring-1 focus:ring-apple-blue transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 bg-apple-blue hover:bg-apple-blue-active text-white rounded-apple-sm text-sm font-bold shadow-sm transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-widest"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'SignUp'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-apple-text-secondary text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-apple-blue hover:text-apple-blue-active font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
