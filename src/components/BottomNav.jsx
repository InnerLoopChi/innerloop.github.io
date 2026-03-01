import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  ClipboardList,
  MessageSquare,
  User,
  Calendar,
  Map,
  LogOut,
} from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isVerifiedInner = profile?.role === 'Inner' && profile?.isVerified;
  const path = location.pathname;

  const tabs = [
    { id: 'feed', label: 'Feed', icon: Home, path: '/feed', show: true },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar', show: true },
    { id: 'map', label: 'Map', icon: Map, path: '/map', show: true },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList, path: '/tasks', show: true },
    { id: 'messages', label: 'DMs', icon: MessageSquare, path: '/messages', show: isVerifiedInner },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', show: true },
  ].filter(t => t.show);

  async function handleLogout() {
    setLoggingOut(true);
    setShowLogoutConfirm(false);
    await logout();
    navigate('/');
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-loop-gray/50">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-1 py-1.5">
        {tabs.map(tab => {
          const isActive = path === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 ${isActive
                ? 'text-loop-purple'
                : 'text-loop-green/35 hover:text-loop-green/60'
                }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-loop-purple" />
                )}
              </div>
              <span className={`text-[9px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-loop-green/35 hover:text-loop-red transition-all duration-200"
        >
          <LogOut size={18} strokeWidth={2} />
          <span className="text-[9px] leading-tight font-medium">Logout</span>
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />

      {/* Logout confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-loop-green/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-full bg-loop-red/10 flex items-center justify-center">
              <LogOut size={24} className="text-loop-red" />
            </div>
            <h3 className="font-display text-lg font-bold">Sign Out?</h3>
            <p className="text-sm text-loop-green/50">Are you sure you want to sign out of InnerLoop?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-loop-gray text-sm font-semibold hover:bg-loop-gray/70 transition-colors">
                Cancel
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-2.5 rounded-full bg-loop-red text-white text-sm font-semibold hover:bg-red-600 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logging out overlay */}
      {loggingOut && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-4 border-loop-purple/30 border-t-loop-purple rounded-full animate-spin" />
            <p className="text-sm font-semibold text-loop-green/60">Signing out...</p>
          </div>
        </div>
      )}
    </nav>
  );
}
