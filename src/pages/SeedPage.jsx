/**
 * SeedPage — Demo data management
 * 
 * Populates the Firestore database with demo users, posts, reviews,
 * conversations, and notifications. Also provides a DB wipe function
 * that clears all collections. Used for testing and hackathon demos.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc, setDoc, addDoc, collection, getDocs, deleteDoc, Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Loader2, Check, Sparkles, Database, Trash2 } from 'lucide-react';

const DEMO_PASSWORD = 'demo1234';

const DEMO_USERS = [
  {
    email: 'looper@demo.com', name: 'Maria G.', role: 'Looper', isVerified: false,
    tags: ['volunteer', 'tutoring', 'humboldt-park'], starRating: 4.8, verifiedHours: 24, loopCredits: 18,
  },
  {
    email: 'looper2@demo.com', name: 'Darius W.', role: 'Looper', isVerified: false,
    tags: ['cleanup', 'garfield-park', 'community'], starRating: 4.5, verifiedHours: 10, loopCredits: 7,
  },
  {
    email: 'looper3@demo.com', name: 'Jasmine R.', role: 'Looper', isVerified: false,
    tags: ['cooking', 'bridgeport', 'youth'], starRating: 4.2, verifiedHours: 5, loopCredits: 3,
  },
  {
    email: 'inner@demo.com', name: 'Pilsen Community Center', role: 'Inner', isVerified: true,
    tags: ['pilsen', 'volunteer', 'youth'], starRating: 4.9, verifiedHours: 156, loopCredits: 0,
  },
  {
    email: 'inner2@demo.com', name: 'Logan Square Food Pantry', role: 'Inner', isVerified: true,
    tags: ['logan-square', 'food', 'seniors', 'delivery'], starRating: 4.7, verifiedHours: 89, loopCredits: 0,
  },
  {
    email: 'inner3@demo.com', name: 'The NaN Center', role: 'Inner', isVerified: true,
    tags: ['bridgeport', 'education', 'tech'], starRating: 4.6, verifiedHours: 42, loopCredits: 0,
  },
];

const DEMO_POSTS = [
  {
    authorEmail: 'inner@demo.com',
    content: 'Looking for 3 volunteers to help sort donated winter coats this Saturday. Meet at the center at 9am. We provide gloves and snacks!',
    tags: ['volunteer', 'pilsen', 'donation'], taskCapacity: 3, taskFilled: 0, hoursReward: 2,
    requirements: ['Must be 16+', 'Able to lift 20 lbs'],
    isInnerOnly: false, minutesAgo: 15,
    schedule: { type: 'single', daysFromNow: 2, startTime: '09:00', endTime: '13:00' },
  },
  {
    authorEmail: 'looper@demo.com',
    content: 'Does anyone know a good after-school tutoring program near Humboldt Park? My son needs help with math.',
    tags: ['tutoring', 'humboldt-park'], taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [], isInnerOnly: false, minutesAgo: 45, schedule: null,
  },
  {
    authorEmail: 'inner2@demo.com',
    content: 'URGENT: We need 5 drivers to deliver meal kits to seniors in the 60647 zip code this Thursday morning. Each route is about 1.5 hours.',
    tags: ['delivery', 'logan-square', 'seniors'], taskCapacity: 5, taskFilled: 2, hoursReward: 1.5,
    requirements: ['Must have car', 'Valid drivers license', 'Speaks English or Spanish'],
    isInnerOnly: false, minutesAgo: 120,
    schedule: { type: 'single', daysFromNow: 4, startTime: '08:00', endTime: '12:00' },
  },
  {
    authorEmail: 'looper2@demo.com',
    content: 'Just finished 10 hours volunteering at the Garfield Park Conservatory cleanup! If anyone wants to join next month, keep an eye on the feed.',
    tags: ['garfield-park', 'cleanup'], taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [], isInnerOnly: false, minutesAgo: 200, schedule: null,
  },
  {
    authorEmail: 'inner@demo.com',
    content: 'Free youth basketball clinic this weekend at Dvorak Park! Ages 8-14. We need 2 volunteers to help coach.',
    tags: ['youth', 'sports', 'pilsen'], taskCapacity: 2, taskFilled: 1, hoursReward: 3,
    requirements: ['Experience with children', 'Must be 18+'],
    isInnerOnly: false, minutesAgo: 300,
    schedule: { type: 'range', daysFromNow: 5, daysEnd: 6, startTime: '10:00', endTime: '14:00' },
  },
  {
    authorEmail: 'inner2@demo.com',
    content: 'Weekly food pantry volunteers needed! Every Tuesday and Thursday we need help sorting and distributing groceries to families in Logan Square.',
    tags: ['food', 'logan-square'], taskCapacity: 4, taskFilled: 0, hoursReward: 2,
    requirements: ['Able to lift 30 lbs'],
    isInnerOnly: false, minutesAgo: 400,
    schedule: { type: 'ongoing' },
  },
  {
    authorEmail: 'looper@demo.com',
    content: 'Shoutout to Pilsen Community Center for the amazing coat drive! Got my kids warm jackets and met so many great neighbors.',
    tags: ['pilsen', 'gratitude'], taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [], isInnerOnly: false, minutesAgo: 500, schedule: null,
  },
  {
    authorEmail: 'inner3@demo.com',
    content: 'Coding workshop for teens this Saturday! Learn Python basics, build your first game. Laptops provided. Need 3 mentors to assist.',
    tags: ['tech', 'education', 'bridgeport'], taskCapacity: 3, taskFilled: 0, hoursReward: 4,
    requirements: ['Basic programming knowledge', 'Comfortable teaching teens'],
    isInnerOnly: false, minutesAgo: 30,
    schedule: { type: 'single', daysFromNow: 3, startTime: '10:00', endTime: '14:00' },
  },
  {
    authorEmail: 'looper3@demo.com',
    content: 'Anyone else going to the Bridgeport community garden cleanup this weekend? Would love to carpool from 35th St!',
    tags: ['bridgeport', 'community', 'cleanup'], taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [], isInnerOnly: false, minutesAgo: 60, schedule: null,
  },
  {
    authorEmail: 'inner@demo.com',
    content: 'INNER ONLY: We have extra folding tables and chairs from our last event. Any other orgs need them? First come first served!',
    tags: ['pilsen', 'resources'], taskCapacity: null, taskFilled: null, hoursReward: null,
    requirements: [], isInnerOnly: true, minutesAgo: 90, schedule: null,
  },
  {
    authorEmail: 'inner3@demo.com',
    content: 'Tutoring volunteers needed for after-school homework help! Monday through Friday, 3PM to 5PM. We especially need math and science help.',
    tags: ['education', 'tutoring', 'bridgeport'], taskCapacity: 6, taskFilled: 3, hoursReward: 2,
    requirements: ['High school diploma or GED', 'Pass background check'],
    isInnerOnly: false, minutesAgo: 350,
    schedule: { type: 'ongoing' },
  },
  {
    authorEmail: 'inner2@demo.com',
    content: 'Spring planting day at the Logan Square community garden! Help us prepare beds and plant vegetables for the neighborhood. Fun for all ages!',
    tags: ['logan-square', 'community', 'gardening'], taskCapacity: 8, taskFilled: 0, hoursReward: 3,
    requirements: ['Wear clothes that can get dirty'],
    isInnerOnly: false, minutesAgo: 10,
    schedule: { type: 'single', daysFromNow: 7, startTime: '09:00', endTime: '13:00' },
  },
];

export default function SeedPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState([]);
  const [running, setRunning] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [done, setDone] = useState(false);

  function log(msg, type = 'info') {
    setStatus(prev => [...prev, { msg, type }]);
  }

  async function clearDatabase() {
    setClearing(true);
    setStatus([]);
    log('Signing in to clear database...', 'info');
    try {
      // Need to be authenticated to read/delete Firestore docs
      try {
        await signInWithEmailAndPassword(auth, 'inner@demo.com', DEMO_PASSWORD);
        log('Authenticated as inner@demo.com', 'info');
      } catch (authErr) {
        // Try another account
        try {
          await signInWithEmailAndPassword(auth, 'looper@demo.com', DEMO_PASSWORD);
          log('Authenticated as looper@demo.com', 'info');
        } catch (authErr2) {
          log('Could not sign in. Trying without auth...', 'info');
        }
      }

      log('Wiping database...', 'info');
      for (const coll of ['posts', 'users', 'conversations', 'applications', 'reviews', 'notifications']) {
        try {
          const qs = await getDocs(collection(db, coll));
          for (const d of qs.docs) { await deleteDoc(doc(db, coll, d.id)); }
          log(`Cleared ${coll} (${qs.size} docs)`, 'success');
        } catch (collErr) {
          log(`${coll}: ${collErr.message}`, 'error');
        }
      }

      try { await signOut(auth); } catch (e) { }
      log('', 'info');
      log('DATABASE WIPED! You can now Run Seed to re-populate.', 'success');
    } catch (err) {
      log('Clear failed: ' + err.message, 'error');
    } finally {
      setClearing(false);
    }
  }

  async function runSeed() {
    setRunning(true);
    setStatus([]);

    try { await signOut(auth); } catch (e) { }
    await new Promise(r => setTimeout(r, 300));

    log('Creating demo accounts...', 'info');
    const userUIDs = {};

    for (const u of DEMO_USERS) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, u.email, DEMO_PASSWORD);
        userUIDs[u.email] = cred.user.uid;
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: u.name, role: u.role, isVerified: u.isVerified,
          tags: u.tags, starRating: u.starRating,
          verifiedHours: u.verifiedHours, loopCredits: u.loopCredits,
          ageVerification: false, location: null, createdAt: Timestamp.now(),
        });
        log(`Created ${u.name} (${u.email})`, 'success');
        await signOut(auth);
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          try {
            const cred = await signInWithEmailAndPassword(auth, u.email, DEMO_PASSWORD);
            userUIDs[u.email] = cred.user.uid;
            await setDoc(doc(db, 'users', cred.user.uid), {
              name: u.name, role: u.role, isVerified: u.isVerified,
              tags: u.tags, starRating: u.starRating,
              verifiedHours: u.verifiedHours, loopCredits: u.loopCredits,
              ageVerification: false, location: null, createdAt: Timestamp.now(),
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

    log('', 'info');
    log('Creating demo posts...', 'info');

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
        let schedule = null;
        if (p.schedule) {
          if (p.schedule.type === 'ongoing') {
            schedule = { type: 'ongoing', startDate: null, endDate: null, startTime: null, endTime: null, ongoing: true };
          } else {
            const startTs = p.schedule.daysFromNow != null
              ? Timestamp.fromDate(new Date(Date.now() + p.schedule.daysFromNow * 86400000))
              : null;
            const endTs = p.schedule.daysEnd != null
              ? Timestamp.fromDate(new Date(Date.now() + p.schedule.daysEnd * 86400000))
              : null;
            schedule = {
              type: p.schedule.type || 'single',
              startDate: startTs, endDate: endTs,
              startTime: p.schedule.startTime || null, endTime: p.schedule.endTime || null,
              ongoing: false,
            };
          }
        }

        // Build applicants array from seed data
        const applicants = [];
        if (p.taskCapacity && p.taskFilled > 0) {
          // Add some dummy accepted applicants
          const looperEmails = ['looper@demo.com', 'looper2@demo.com', 'looper3@demo.com'];
          for (let i = 0; i < Math.min(p.taskFilled, looperEmails.length); i++) {
            const looperUID = userUIDs[looperEmails[i]];
            const looper = DEMO_USERS.find(u => u.email === looperEmails[i]);
            if (looperUID && looperUID !== authorUID) {
              applicants.push({
                uid: looperUID, name: looper.name, status: 'accepted',
                appliedAt: Timestamp.fromDate(new Date(Date.now() - (p.minutesAgo + 5) * 60000)),
                answers: p.requirements.map(() => true),
              });
            }
          }
        }

        await addDoc(collection(db, 'posts'), {
          authorID: authorUID, authorName: author.name, authorRole: author.role,
          content: p.content, tags: p.tags,
          postTime: Timestamp.fromDate(new Date(Date.now() - p.minutesAgo * 60000)),
          isInnerOnly: p.isInnerOnly, taskCapacity: p.taskCapacity,
          taskFilled: p.taskFilled, waitlist: [], joinedUsers: [],
          hoursReward: p.hoursReward, requirements: p.requirements || [],
          applicants, status: 'active', schedule, location: null,
        });
        log(`"${p.content.slice(0, 50)}..."`, 'success');
      } catch (err) {
        log(`Post failed: ${err.message}`, 'error');
      }
    }

    // Reviews
    log('', 'info');
    log('Creating demo reviews...', 'info');
    try {
      if (userUIDs['inner@demo.com'] && userUIDs['looper@demo.com']) {
        await addDoc(collection(db, 'reviews'), {
          reviewerID: userUIDs['inner@demo.com'], reviewedID: userUIDs['looper@demo.com'],
          rating: 5, hoursVerified: 2,
          comment: 'Maria was incredible — arrived early and stayed late to help. A true asset!',
          wasWaitlisted: false, createdAt: Timestamp.now(),
        });
        log('Pilsen CC → Maria G. (5 stars)', 'success');
      }
      if (userUIDs['inner2@demo.com'] && userUIDs['looper2@demo.com']) {
        await addDoc(collection(db, 'reviews'), {
          reviewerID: userUIDs['inner2@demo.com'], reviewedID: userUIDs['looper2@demo.com'],
          rating: 4, hoursVerified: 3,
          comment: 'Darius handled the delivery route efficiently. Would welcome back!',
          wasWaitlisted: true, createdAt: Timestamp.now(),
        });
        log('Logan Sq → Darius W. (4 stars, 2x bonus)', 'success');
      }
      if (userUIDs['inner3@demo.com'] && userUIDs['looper3@demo.com']) {
        await addDoc(collection(db, 'reviews'), {
          reviewerID: userUIDs['inner3@demo.com'], reviewedID: userUIDs['looper3@demo.com'],
          rating: 5, hoursVerified: 4,
          comment: 'Jasmine was a natural with the kids during the coding workshop. Highly recommend!',
          wasWaitlisted: false, createdAt: Timestamp.now(),
        });
        log('NaN Center → Jasmine R. (5 stars)', 'success');
      }
    } catch (err) {
      log(`Review failed: ${err.message}`, 'error');
    }

    // Conversations
    log('', 'info');
    log('Creating demo conversations...', 'info');
    try {
      if (userUIDs['inner@demo.com'] && userUIDs['inner2@demo.com']) {
        const convoRef = await addDoc(collection(db, 'conversations'), {
          participants: [userUIDs['inner@demo.com'], userUIDs['inner2@demo.com']],
          participantNames: {
            [userUIDs['inner@demo.com']]: 'Pilsen Community Center',
            [userUIDs['inner2@demo.com']]: 'Logan Square Food Pantry',
          },
          lastMessage: 'We have extra tables if you need them for the food drive!',
          lastMessageAt: Timestamp.now(),
          lastSenderID: userUIDs['inner@demo.com'],
          [`unread_${userUIDs['inner2@demo.com']}`]: 1,
          createdAt: Timestamp.now(),
          status: 'accepted',
          senderId: userUIDs['inner@demo.com'],
        });
        await addDoc(collection(db, 'conversations', convoRef.id, 'messages'), {
          senderID: userUIDs['inner@demo.com'],
          senderName: 'Pilsen Community Center',
          text: 'Hey! Just wanted to check — are you still running the Saturday food drive?',
          sentAt: Timestamp.fromDate(new Date(Date.now() - 3600000)),
        });
        await addDoc(collection(db, 'conversations', convoRef.id, 'messages'), {
          senderID: userUIDs['inner2@demo.com'],
          senderName: 'Logan Square Food Pantry',
          text: 'Yes! Every Saturday 9am-1pm. Would love some extra hands!',
          sentAt: Timestamp.fromDate(new Date(Date.now() - 1800000)),
        });
        await addDoc(collection(db, 'conversations', convoRef.id, 'messages'), {
          senderID: userUIDs['inner@demo.com'],
          senderName: 'Pilsen Community Center',
          text: 'We have extra tables if you need them for the food drive!',
          sentAt: Timestamp.now(),
        });
        log('Pilsen CC ↔ Logan Sq (accepted, 3 messages)', 'success');
      }
      // Pending DM example
      if (userUIDs['looper@demo.com'] && userUIDs['inner@demo.com']) {
        await addDoc(collection(db, 'conversations'), {
          participants: [userUIDs['looper@demo.com'], userUIDs['inner@demo.com']],
          participantNames: {
            [userUIDs['looper@demo.com']]: 'Maria G.',
            [userUIDs['inner@demo.com']]: 'Pilsen Community Center',
          },
          lastMessage: 'Hi! I wanted to ask about the coat drive schedule.',
          lastMessageAt: Timestamp.now(),
          lastSenderID: userUIDs['looper@demo.com'],
          [`unread_${userUIDs['inner@demo.com']}`]: 1,
          createdAt: Timestamp.now(),
          status: 'pending',
          senderId: userUIDs['looper@demo.com'],
        });
        log('Maria → Pilsen CC (pending request)', 'success');
      }
    } catch (err) {
      log(`Convo failed: ${err.message}`, 'error');
    }

    // Notifications
    log('', 'info');
    log('Creating demo notifications...', 'info');
    try {
      if (userUIDs['looper@demo.com']) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: userUIDs['looper@demo.com'],
          type: 'review',
          message: 'Pilsen Community Center left you a 5-star review!',
          read: false,
          createdAt: Timestamp.fromDate(new Date(Date.now() - 600000)),
          link: '/profile',
        });
        await addDoc(collection(db, 'notifications'), {
          recipientId: userUIDs['looper@demo.com'],
          type: 'accepted',
          message: 'Your application to "Meal kit delivery" was accepted!',
          read: false,
          createdAt: Timestamp.fromDate(new Date(Date.now() - 1200000)),
          link: '/tasks',
        });
        log('2 notifications for Maria G.', 'success');
      }
      if (userUIDs['inner@demo.com']) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: userUIDs['inner@demo.com'],
          type: 'application',
          message: 'Maria G. applied to your coat sorting task!',
          read: false,
          createdAt: Timestamp.fromDate(new Date(Date.now() - 300000)),
          link: '/tasks',
        });
        await addDoc(collection(db, 'notifications'), {
          recipientId: userUIDs['inner@demo.com'],
          type: 'dm_request',
          message: 'Maria G. sent you a message request.',
          read: false,
          createdAt: Timestamp.now(),
          link: '/messages',
        });
        log('2 notifications for Pilsen CC', 'success');
      }
    } catch (err) {
      log(`Notification failed: ${err.message}`, 'error');
    }

    try { await signOut(auth); } catch (e) { }

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
                <h2 className="font-display text-lg font-bold">Demo Data Manager</h2>
                <p className="text-xs text-loop-green/40">6 accounts · 12 posts · 3 reviews · DMs · notifications</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-loop-blue/10 border border-loop-blue/15 text-xs space-y-1 text-loop-green/60">
              <p className="font-semibold text-loop-green/80 text-sm">Demo accounts (password: demo1234)</p>
              <p>looper@demo.com — Maria G. (Looper)</p>
              <p>looper2@demo.com — Darius W. (Looper)</p>
              <p>looper3@demo.com — Jasmine R. (Looper)</p>
              <p>inner@demo.com — Pilsen Community Center (Inner ✓)</p>
              <p>inner2@demo.com — Logan Square Food Pantry (Inner ✓)</p>
              <p>inner3@demo.com — The NaN Center (Inner ✓)</p>
            </div>

            <div className="flex gap-2">
              <button onClick={clearDatabase} disabled={clearing || running}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold text-sm transition-all
                  ${clearing ? 'bg-loop-red/60 text-white' : 'bg-loop-red/10 text-loop-red hover:bg-loop-red/20 border border-loop-red/20'}`}>
                {clearing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {clearing ? 'Clearing...' : 'Clear DB'}
              </button>

              {!done ? (
                <button onClick={runSeed} disabled={running || clearing}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold text-sm text-white transition-all
                    ${running ? 'bg-loop-purple/60' : 'bg-loop-purple hover:shadow-lg hover:scale-[1.02]'}`}>
                  {running ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {running ? 'Seeding...' : 'Run Seed'}
                </button>
              ) : (
                <button onClick={() => navigate('/login')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-loop-green font-semibold text-sm text-white hover:shadow-lg transition-all">
                  <Check size={18} /> Go to Login
                </button>
              )}
            </div>
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
