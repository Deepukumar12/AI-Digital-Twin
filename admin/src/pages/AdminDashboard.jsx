import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Database, BrainCircuit, Trash2, Shield, User, Loader2, Activity, FileText, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [users, setUsers] = useState([]);
  const [twins, setTwins] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Create Admin state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, twinsRes, memoriesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/twins'),
        api.get('/admin/memories')
      ]);
      setStatsData(statsRes.data);
      setUsers(usersRes.data);
      setTwins(twinsRes.data);
      setMemories(memoriesRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setStatsData(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await api.post('/admin/users', { 
        email: newAdminEmail, 
        password: newAdminPassword 
      });
      setUsers([response.data.user, ...users]);
      setStatsData(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
      toast.success('Admin user created successfully');
      setShowCreateModal(false);
      setNewAdminEmail('');
      setNewAdminPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-apple-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-apple-text-primary tracking-tight">Admin Dashboard</h1>
          <p className="text-apple-text-secondary">Manage system, users, twins, and AI memories</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-apple-divider mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-apple-blue text-apple-blue'
                : 'border-transparent text-apple-text-secondary hover:text-apple-text-primary hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'border-apple-blue text-apple-blue'
                : 'border-transparent text-apple-text-secondary hover:text-apple-text-primary hover:border-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('twins')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'twins'
                ? 'border-apple-blue text-apple-blue'
                : 'border-transparent text-apple-text-secondary hover:text-apple-text-primary hover:border-gray-300'
            }`}
          >
            Digital Twins
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'memories'
                ? 'border-apple-blue text-apple-blue'
                : 'border-transparent text-apple-text-secondary hover:text-apple-text-primary hover:border-gray-300'
            }`}
          >
            AI Memories
          </button>
        </nav>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-apple-card border border-apple-divider rounded-apple-card p-6 flex items-center shadow-sm">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-apple-text-secondary font-medium">Total Users</p>
                <p className="text-2xl font-bold text-apple-text-primary">{statsData?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="bg-apple-card border border-apple-divider rounded-apple-card p-6 flex items-center shadow-sm">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <BrainCircuit className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-apple-text-secondary font-medium">Total Digital Twins</p>
                <p className="text-2xl font-bold text-apple-text-primary">{statsData?.totalTwins || 0}</p>
              </div>
            </div>
            <div className="bg-apple-card border border-apple-divider rounded-apple-card p-6 flex items-center shadow-sm">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-apple-text-secondary font-medium">Total Vector Memories</p>
                <p className="text-2xl font-bold text-apple-text-primary">{statsData?.totalMemories || 0}</p>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-apple-card border border-apple-divider rounded-apple-card p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Activity className="h-5 w-5 text-apple-blue mr-2" />
                <h3 className="text-lg font-bold text-apple-text-primary">Platform Intelligence</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-apple-text-secondary">Avg Career Readiness</span>
                    <span className="text-sm font-bold text-apple-text-primary">{statsData?.avgReadiness || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${statsData?.avgReadiness || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-apple-text-secondary">Avg Goal Alignment</span>
                    <span className="text-sm font-bold text-apple-text-primary">{statsData?.avgAlignment || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${statsData?.avgAlignment || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-apple-card border border-apple-divider rounded-apple-card p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <BarChart2 className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="text-lg font-bold text-apple-text-primary">Top Career Domains</h3>
              </div>
              {statsData?.topDomains && statsData.topDomains.length > 0 ? (
                <ul className="space-y-3">
                  {statsData.topDomains.map((domain, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-apple-text-primary">{domain.name}</span>
                      <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 py-1 px-2 rounded-full font-bold">
                        {domain.count} Twins
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-apple-text-secondary">No domain data available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-apple-card border border-apple-divider rounded-apple-card shadow-sm overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-apple-divider flex justify-between items-center">
            <h2 className="text-lg font-bold text-apple-text-primary">User Management</h2>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-apple-blue hover:bg-apple-blue-active text-white px-4 py-2 rounded-apple-sm text-sm font-bold transition-colors shadow-sm"
            >
              + Create Admin
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-apple-bg/50">
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-divider">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-apple-bg/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-apple-text-primary">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {user.role === 'user' ? (
                          <button
                            onClick={() => handleRoleChange(user._id, 'admin')}
                            className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400 p-1"
                            title="Make Admin"
                          >
                            <Shield className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user._id, 'user')}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                            title="Revoke Admin"
                          >
                            <User className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 ml-2"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-apple-text-secondary text-sm">
                No users found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TWINS TAB */}
      {activeTab === 'twins' && (
        <div className="bg-apple-card border border-apple-divider rounded-apple-card shadow-sm overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-apple-divider">
            <h2 className="text-lg font-bold text-apple-text-primary">Digital Twins Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-apple-bg/50">
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">Primary Domain</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">Target Role</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">Readiness</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-divider">
                {twins.map(twin => (
                  <tr key={twin._id} className="hover:bg-apple-bg/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-apple-text-primary">
                      {twin.userId?.email || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-text-secondary">
                      {twin.primary_domain || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-text-secondary">
                      {twin.target_role || 'Not Set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-bold mr-2 text-apple-text-primary">{twin.career_readiness_score || 0}%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${twin.career_readiness_score || 0}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-text-secondary">
                      {new Date(twin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {twins.length === 0 && (
              <div className="text-center py-8 text-apple-text-secondary text-sm">
                No digital twins found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEMORIES TAB */}
      {activeTab === 'memories' && (
        <div className="bg-apple-card border border-apple-divider rounded-apple-card shadow-sm overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-apple-divider">
            <h2 className="text-lg font-bold text-apple-text-primary">AI Vector Memories (Recent 100)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-apple-bg/50">
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider w-1/4">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider w-1/2">Memory Content Preview</th>
                  <th className="px-6 py-3 text-xs font-semibold text-apple-text-secondary uppercase tracking-wider w-1/4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-apple-divider">
                {memories.map(memory => (
                  <tr key={memory._id} className="hover:bg-apple-bg/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-apple-text-primary">
                      {memory.userId?.email || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 text-sm text-apple-text-secondary truncate max-w-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{memory.document}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-apple-text-secondary">
                      {new Date(memory.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {memories.length === 0 && (
              <div className="text-center py-8 text-apple-text-secondary text-sm">
                No vector memories found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-apple-card border border-apple-divider rounded-apple-card p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-apple-text-primary mb-4">Create New Admin</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-apple-text-muted uppercase tracking-widest mb-1 pl-1">Email</label>
                <input 
                  type="email" 
                  required 
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-apple-bg border border-apple-divider rounded-apple-sm text-apple-text-primary outline-none focus:ring-1 focus:ring-apple-blue"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-apple-text-muted uppercase tracking-widest mb-1 pl-1">Password</label>
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-apple-bg border border-apple-divider rounded-apple-sm text-apple-text-primary outline-none focus:ring-1 focus:ring-apple-blue"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-bold text-apple-text-secondary hover:text-apple-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-4 py-2 bg-apple-blue hover:bg-apple-blue-active text-white rounded-apple-sm text-sm font-bold disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isCreating ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
