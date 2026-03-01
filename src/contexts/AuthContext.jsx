import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          // Firebase Auth user
  const [profile, setProfile] = useState(null);     // Firestore user doc
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state + realtime profile
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let profileUnsub = null;

    const authUnsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // Clean up previous profile listener
      if (profileUnsub) {
        profileUnsub();
        profileUnsub = null;
      }

      if (firebaseUser) {
        // Realtime listener for profile — keeps data in sync
        profileUnsub = onSnapshot(doc(db, 'users', firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            setProfile({ id: snap.id, ...snap.data() });
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, () => {
          setProfile(null);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();
      if (profileUnsub) profileUnsub();
    };
  }, []);

  // Sign up — creates Auth user + Firestore user doc
  async function signup({ email, password, name, role }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    const userData = {
      name,
      role,                        // "Looper" or "Inner"
      tags: [],
      isVerified: false,
      location: null,
      ageVerification: false,
      starRating: null,
      reviewCount: 0,
      verifiedHours: 0,
      loopCredits: 0,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), userData);
    // Profile will be set automatically by the onSnapshot listener
    return cred.user;
  }

  // Login
  async function login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Profile will be set automatically by the onSnapshot listener
    return cred.user;
  }

  // Logout
  async function logout() {
    await signOut(auth);
    // user and profile will be cleared by the onAuthStateChanged listener
  }

  const value = { user, profile, loading, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
