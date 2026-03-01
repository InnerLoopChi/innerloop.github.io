import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Shield,
  AlertTriangle,
  Loader2,
  Check,
  X,
  User,
  Building2,
  Heart,
  LogOut,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isInner = profile?.role === 'Inner';

  // Save name
  async function handleSaveName() {
    if (!newName.trim() || newName.trim() === profile?.name) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { name: newName.trim() });
      toast.success('Name updated!');
      setEditingName(false);
    } catch (err) {
      toast.error('Failed to update name.');
    } finally {
      setSavingName(false);
    }
  }

  // Delete account
  async function handleDeleteAccount() {
    if (deleteText !== 'DELETE') return;
    setDeleting(true);
    try {
      // Delete user's posts
      const postsQ = query(collection(db, 'posts'), where('authorID', '==', user.uid));
      const postsSnap = await getDocs(postsQ);
      const batch = writeBatch(db);
      postsSnap.docs.forEach(d => batch.delete(d.ref));

      // Delete user doc
      batch.delete(doc(db, 'users', user.uid));
      await batch.commit();

      // Delete Firebase auth account
      await deleteUser(auth.currentUser);

      navigate('/');
    } catch (err) {
      console.error('Delete error:', err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign back in before deleting your account.');
      } else {
        toast.error('Failed to delete account. Please try again.');
      }
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/profile')} className="flex items-center gap-1.5 text-sm font-medium text-loop-green/60 hover:text-loop-green transition-colors">
            <ArrowLeft size={18} /> Profile
          </button>
          <span className="font-display text-lg font-extrabold">Settings</span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-loop-gray/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-loop-gray/30">
            <h2 className="font-display font-bold flex items-center gap-2">
              <User size={16} /> Account
            </h2>
          </div>

          {/* Name */}
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-loop-green/40 mb-1">Name</p>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-loop-purple/30 text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20"
                    autoFocus
                  />
                  <button onClick={handleSaveName} disabled={savingName} className="p-1.5 rounded-lg bg-loop-green text-white hover:shadow-md transition-all">
                    {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  </button>
                  <button onClick={() => { setEditingName(false); setNewName(profile?.name || ''); }} className="p-1.5 rounded-lg bg-loop-gray hover:bg-loop-gray/80 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <p className="text-sm font-semibold">{profile?.name}</p>
              )}
            </div>
            {!editingName && (
              <button onClick={() => setEditingName(true)} className="p-2 rounded-lg hover:bg-loop-gray transition-colors">
                <Edit3 size={14} className="text-loop-green/40" />
              </button>
            )}
          </div>

          {/* Email */}
          <div className="px-5 py-4 border-t border-loop-gray/30">
            <p className="text-xs text-loop-green/40 mb-1">Email</p>
            <p className="text-sm">{user?.email}</p>
          </div>

          {/* Role */}
          <div className="px-5 py-4 border-t border-loop-gray/30">
            <p className="text-xs text-loop-green/40 mb-1">Role</p>
            <div className="flex items-center gap-2">
              {isInner
                ? <Building2 size={14} className="text-loop-purple" />
                : <Heart size={14} className="text-loop-red" />
              }
              <p className="text-sm font-medium">{profile?.role}</p>
              {profile?.isVerified && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-loop-purple/10 text-loop-purple text-xs font-semibold">
                  <Shield size={9} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={async () => { await logout(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-loop-gray/50 text-sm font-semibold text-loop-green/70 hover:bg-loop-gray/30 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-loop-red/20 overflow-hidden">
          <div className="px-5 py-4 border-b border-loop-red/10 bg-loop-red/5">
            <h2 className="font-display font-bold text-loop-red flex items-center gap-2">
              <AlertTriangle size={16} /> Danger Zone
            </h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-loop-green/50 mb-4">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-loop-red/30 text-loop-red text-sm font-semibold hover:bg-loop-red/5 transition-colors"
              >
                <Trash2 size={14} /> Delete Account
              </button>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-loop-red/5 border border-loop-red/15">
                <p className="text-sm font-semibold text-loop-red">
                  Type "DELETE" to confirm:
                </p>
                <input
                  type="text"
                  value={deleteText}
                  onChange={e => setDeleteText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 rounded-lg border border-loop-red/30 text-sm focus:outline-none focus:ring-2 focus:ring-loop-red/20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteText !== 'DELETE' || deleting}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all ${
                      deleteText === 'DELETE' ? 'bg-loop-red hover:shadow-md' : 'bg-loop-red/40 cursor-not-allowed'
                    }`}
                  >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete Forever
                  </button>
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
                    className="px-4 py-2 rounded-full bg-loop-gray text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
