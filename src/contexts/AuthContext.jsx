import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
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

  // Listen to Firebase auth state
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
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
      verifiedHours: 0,
      loopCredits: 0,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), userData);
    setProfile({ id: cred.user.uid, ...userData });
    return cred.user;
  }

  // Login
  async function login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    return cred.user;
  }

  // Logout
  async function logout() {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }

  const value = { user, profile, loading, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
