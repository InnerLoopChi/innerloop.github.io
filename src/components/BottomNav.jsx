import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  ClipboardList,
  MessageSquare,
  User,
} from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const isVerifiedInner = profile?.role === 'Inner' && profile?.isVerified;
  const path = location.pathname;

  const tabs = [
    { id: 'feed', label: 'Feed', icon: Home, path: '/feed', show: true },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList, path: '/tasks', show: true },
    { id: 'messages', label: 'DMs', icon: MessageSquare, path: '/messages', show: isVerifiedInner },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', show: true },
  ].filter(t => t.show);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-loop-gray/50 sm:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const isActive = path === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-loop-purple'
                  : 'text-loop-green/35 hover:text-loop-green/60'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-loop-purple" />
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area padding for notch phones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
