import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Loader2, Check, Sparkles, Database } from 'lucide-react';

const DEMO_PASSWORD = 'demo1234';

const DEMO_USERS = [
  {
    email: 'looper@demo.com',
    name: 'Maria G.',
    role: 'Looper',
    isVerified: false,
    tags: ['volunteer', 'tutoring', 'humboldt-park'],
    starRating: 4.8,
    verifiedHours: 24,
    loopCredits: 18,
  },
  {
    email: 'looper2@demo.com',
    name: 'Darius W.',
    role: 'Looper',
    isVerified: false,
    tags: ['cleanup', 'garfield-park', 'community'],
    starRating: 4.5,
    verifiedHours: 10,
    loopCredits: 7,
  },
  {
    email: 'inner@demo.com',
    name: 'Pilsen Community Center',
    role: 'Inner',
    isVerified: true,
    tags: ['pilsen', 'volunteer', 'youth'],
    starRating: 4.9,
    verifiedHours: 156,
    loopCredits: 0,
  },
  {
    email: 'inner2@demo.com',
    name: 'Logan Square Food Pantry',
    role: 'Inner',
    isVerified: true,
    tags: ['logan-square', 'food', 'seniors', 'delivery'],
    starRating: 4.7,
    verifiedHours: 89,
    loopCredits: 0,
  },
];

const DEMO_POSTS = [
  {
    authorEmail: 'inner@demo.com',
    content: 'Looking for 3 volunteers to help sort donated winter coats this Saturday. Meet at the center at 9am. We provide gloves and snacks!',
    tags: ['volunteer', 'pilsen', 'donation'],
    taskCapacity: 3, taskFilled: 0, hoursReward: 2,
    requirements: ['Must be 16+', 'Able to lift 20 lbs'],
    isInnerOnly: false, minutesAgo: 15,
  },
  {
    authorEmail: 'looper@demo.com',
    content: 'Does anyone know a good after-school tutoring program near Humboldt Park? My son needs help with math.',
    tags: ['tutoring', 'humboldt-park'],
    taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [],
    isInnerOnly: false, minutesAgo: 45,
  },
  {
    authorEmail: 'inner2@demo.com',
    content: 'URGENT: We need 5 drivers to deliver meal kits to seniors in the 60647 zip code this Thursday morning. Each route is about 1.5 hours.',
    tags: ['delivery', 'logan-square', 'seniors'],
    taskCapacity: 5, taskFilled: 0, hoursReward: 1.5,
    requirements: ['Must have car', 'Valid drivers license', 'Speaks English or Spanish'],
    isInnerOnly: false, minutesAgo: 120,
  },
  {
    authorEmail: 'looper2@demo.com',
    content: 'Just finished 10 hours volunteering at the Garfield Park Conservatory cleanup! If anyone wants to join next month, keep an eye on the feed.',
    tags: ['garfield-park', 'cleanup'],
    taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [],
    isInnerOnly: false, minutesAgo: 200,
  },
  {
    authorEmail: 'inner@demo.com',
    content: 'Free youth basketball clinic this weekend at Dvorak Park! Ages 8-14. We need 2 volunteers to help coach.',
    tags: ['youth', 'sports', 'pilsen'],
    taskCapacity: 2, taskFilled: 0, hoursReward: 3,
    requirements: ['Experience with children', 'Must be 18+'],
    isInnerOnly: false, minutesAgo: 300,
  },
  {
    authorEmail: 'inner2@demo.com',
    content: 'We have extra canned goods and dry pasta available for any community org that needs them. DM us to arrange pickup.',
    tags: ['resources', 'food'],
    taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [],
    isInnerOnly: true, minutesAgo: 400,
  },
  {
    authorEmail: 'looper@demo.com',
    content: 'Shoutout to Pilsen Community Center for the amazing coat drive! Got my kids warm jackets and met so many great neighbors.',
    tags: ['pilsen', 'gratitude'],
    taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [],
    isInnerOnly: false, minutesAgo: 500,
  },
];

export default function SeedPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  function log(msg, type = 'info') {
    setStatus(prev => [...prev, { msg, type }]);
  }

  async function runSeed() {
    setRunning(true);
    setStatus([]);

    // Sign out first
    try { await signOut(auth); } catch (e) {}
    await new Promise(r => setTimeout(r, 300));

    // Step 1: Create accounts sequentially
    log('Creating demo accounts...', 'info');
    const userUIDs = {};

    for (const u of DEMO_USERS) {
      try {
        // Try create
        const cred = await createUserWithEmailAndPassword(auth, u.email, DEMO_PASSWORD);
        userUIDs[u.email] = cred.user.uid;
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: u.name, role: u.role, isVerified: u.isVerified,
          tags: u.tags, starRating: u.starRating,
          verifiedHours: u.verifiedHours, loopCredits: u.loopCredits,
          ageVerification: false, location: null, createdAt: serverTimestamp(),
        });
        log(`Created ${u.name} (${u.email})`, 'success');
        await signOut(auth);
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          try {
            const cred = await signInWithEmailAndPassword(auth, u.email, DEMO_PASSWORD);
            userUIDs[u.email] = cred.user.uid;
            // Update profile to ensure it's correct
            await setDoc(doc(db, 'users', cred.user.uid), {
              name: u.name, role: u.role, isVerified: u.isVerified,
              tags: u.tags, starRating: u.starRating,
              verifiedHours: u.verifiedHours, loopCredits: u.loopCredits,
              ageVerification: false, location: null, createdAt: serverTimestamp(),
            });
            log(`Updated ${u.name} (already existed)`, 'info');
            await signOut(auth);
          } catch (e2) {
            log(`Failed ${u.email}: ${e2.message}`, 'error');
          }
        } else {
          log(`Failed ${u.email}: ${err.message}`, 'error');
        }
      }
      await new Promise(r => setTimeout(r, 400));
    }

    // Step 2: Sign in as inner@demo.com to create posts (needs auth for Firestore)
    log('', 'info');
    log('Creating demo posts...', 'info');

    // Sign in as one user to write posts
    try {
      await signInWithEmailAndPassword(auth, 'inner@demo.com', DEMO_PASSWORD);
    } catch (e) {
      log('Could not sign in to create posts: ' + e.message, 'error');
    }

    for (const p of DEMO_POSTS) {
      const authorUID = userUIDs[p.authorEmail];
      if (!authorUID) { log(`Skipped — no UID for ${p.authorEmail}`, 'error'); continue; }
      const author = DEMO_USERS.find(u => u.email === p.authorEmail);
      try {
        await addDoc(collection(db, 'posts'), {
          authorID: authorUID,
          authorName: author.name,
          authorRole: author.role,
          content: p.content,
          tags: p.tags,
          postTime: Timestamp.fromDate(new Date(Date.now() - p.minutesAgo * 60000)),
          isInnerOnly: p.isInnerOnly,
          taskCapacity: p.taskCapacity,
          taskFilled: p.taskFilled,
          waitlist: [],
          joinedUsers: [],
          hoursReward: p.hoursReward,
          requirements: p.requirements || [],
          applicants: [],
          status: 'active',
          location: null,
        });
        log(`"${p.content.slice(0, 40)}..."`, 'success');
      } catch (err) {
        log(`Post failed: ${err.message}`, 'error');
      }
    }

    // Step 3: Reviews
    log('', 'info');
    log('Creating demo reviews...', 'info');
    try {
      if (userUIDs['inner@demo.com'] && userUIDs['looper@demo.com']) {
        await addDoc(collection(db, 'reviews'), {
          reviewerID: userUIDs['inner@demo.com'],
          reviewedID: userUIDs['looper@demo.com'],
          rating: 5, hoursVerified: 2,
          comment: 'Maria was incredible — arrived early and stayed to help. A true asset!',
          wasWaitlisted: false, createdAt: serverTimestamp(),
        });
        log('Pilsen CC → Maria G. (5 stars)', 'success');
      }
      if (userUIDs['inner2@demo.com'] && userUIDs['looper2@demo.com']) {
        await addDoc(collection(db, 'reviews'), {
          reviewerID: userUIDs['inner2@demo.com'],
          reviewedID: userUIDs['looper2@demo.com'],
          rating: 4, hoursVerified: 3,
          comment: 'Darius handled the delivery route efficiently. Would welcome back!',
          wasWaitlisted: true, createdAt: serverTimestamp(),
        });
        log('Logan Sq → Darius W. (4 stars, 2x bonus)', 'success');
      }
    } catch (err) {
      log(`Review failed: ${err.message}`, 'error');
    }

    // Sign out when done
    try { await signOut(auth); } catch (e) {}

    log('', 'info');
    log('SEED COMPLETE! Go to Login to try demo accounts.', 'success');
    setDone(true);
    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-loop-gray flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-extrabold text-loop-green">
            Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-loop-gray/50 overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-loop-purple/10 flex items-center justify-center">
                <Database size={22} className="text-loop-purple" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Seed Demo Data</h2>
                <p className="text-xs text-loop-green/40">4 accounts · 7 posts · 2 reviews</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-loop-blue/10 border border-loop-blue/15 text-xs space-y-1 text-loop-green/60">
              <p className="font-semibold text-loop-green/80 text-sm">Demo accounts (password: demo1234)</p>
              <p>looper@demo.com — Maria G. (Looper)</p>
              <p>looper2@demo.com — Darius W. (Looper)</p>
              <p>inner@demo.com — Pilsen Community Center (Inner ✓)</p>
              <p>inner2@demo.com — Logan Square Food Pantry (Inner ✓)</p>
            </div>

            {!done ? (
              <button onClick={runSeed} disabled={running}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white transition-all
                  ${running ? 'bg-loop-purple/60' : 'bg-loop-purple hover:shadow-lg hover:scale-[1.02]'}`}>
                {running ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {running ? 'Seeding...' : 'Run Seed'}
              </button>
            ) : (
              <button onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-loop-green font-semibold text-sm text-white hover:shadow-lg transition-all">
                <Check size={18} /> Go to Login
              </button>
            )}
          </div>

          {status.length > 0 && (
            <div className="border-t border-loop-gray/30 px-6 py-4 max-h-72 overflow-y-auto">
              <div className="space-y-0.5 font-mono text-xs">
                {status.map((s, i) => (
                  <p key={i} className={s.type === 'success' ? 'text-green-600' : s.type === 'error' ? 'text-loop-red' : 'text-loop-green/50'}>
                    {s.msg || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
