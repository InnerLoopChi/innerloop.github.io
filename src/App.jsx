import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isFirebaseConfigured } from './lib/firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import FirebaseSetup from './components/FirebaseSetup';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import MyTasksPage from './pages/MyTasksPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import SeedPage from './pages/SeedPage';
import BottomNav from './components/BottomNav';

// Protected route — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-loop-gray flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-loop-purple/30 border-t-loop-purple rounded-full animate-spin" />
      </div>
    );
  }
  return user ? (
    <>
      <div className="pb-16 sm:pb-0">{children}</div>
      <BottomNav />
    </>
  ) : <Navigate to="/login" />;
}

// Redirect authenticated users away from auth pages
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-loop-gray flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-loop-purple/30 border-t-loop-purple rounded-full animate-spin" />
      </div>
    );
  }
  return user ? <Navigate to="/feed" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth (guest only) */}
      <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

      {/* Protected — feed placeholder for now */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />

      {/* Protected — profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected — my tasks */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <MyTasksPage />
          </ProtectedRoute>
        }
      />

      {/* Protected — Inner Loop DMs */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />

      {/* Protected — settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Seed demo data (public — one-time use) */}
      <Route path="/seed" element={<SeedPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  // If Firebase isn't configured, show setup instructions
  if (!isFirebaseConfigured) {
    return <FirebaseSetup />;
  }

  return (
    <BrowserRouter basename="/innerloop.github.io">
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
