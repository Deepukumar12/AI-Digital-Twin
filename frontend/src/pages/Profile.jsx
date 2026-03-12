import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Briefcase, Award, Save, X, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', bio: '' });
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
            setEditData({ name: res.data.name || '', bio: res.data.bio || '' });
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const res = await api.put('/auth/me', editData);
            setUser({ ...user, ...res.data.user });
            setIsEditing(false);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        if (passwords.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setIsUpdatingPassword(true);
        try {
            await api.put('/auth/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success('Password updated successfully!');
            setIsSecurityOpen(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-full shadow-lg">
                            <User className="h-12 w-12 text-white" />
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                    className="bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-2xl font-bold focus:ring-2 focus:ring-primary-500 outline-none w-full"
                                    placeholder="Your Name"
                                />
                            ) : (
                                <h1 className="text-2xl font-extrabold dark:text-white">{user?.name || 'Set Your Name'}</h1>
                            )}
                            <p className="text-gray-500 flex items-center mt-1"><Mail className="h-4 w-4 mr-2" /> {user?.email}</p>
                        </div>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl font-bold hover:bg-primary-100 transition shadow-sm"
                        >
                            <Edit2 className="h-4 w-4" />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-md disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Bio</h3>
                    {isEditing ? (
                        <textarea
                            value={editData.bio}
                            onChange={e => setEditData({ ...editData, bio: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="Tell AI about your career goals..."
                        />
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl italic">
                            {user?.bio || "No bio added. Adding a bio helps the AI refine its career advice."}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center mb-2">
                            <Briefcase className="h-5 w-5 mr-2 text-primary-500" /> Account Security
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Password management and security settings are handled here.</p>
                        <button
                            onClick={() => setIsSecurityOpen(true)}
                            className="mt-4 w-full py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                        >Update Security</button>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <button onClick={() => navigate('/dashboard')} className="text-primary-600 dark:text-primary-400 font-bold hover:underline">← Back to Dashboard</button>
                    <p className="text-xs text-gray-400 italic">Version 1.0.0</p>
                </div>
            </div>
            {/* Security / Password Modal */}
            {isSecurityOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Update Password</h2>
                            <button onClick={() => setIsSecurityOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsSecurityOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition font-bold">Cancel</button>
                                <button type="submit" disabled={isUpdatingPassword} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold shadow disabled:opacity-50">
                                    {isUpdatingPassword ? 'Updating...' : 'Save Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
