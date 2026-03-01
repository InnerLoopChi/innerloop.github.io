import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ReviewModal from '../components/ReviewModal';
import {
  Users, Clock, Check, CheckCircle2, Zap, Loader2, Star,
  Building2, Heart, ChevronDown, ChevronUp, Shield, X,
  ClipboardCheck, UserCheck, UserX, MessageSquare,
} from 'lucide-react';

export default function MyTasksPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isInner = profile?.role === 'Inner';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    // Single simple query for everyone — filter client-side
    const q = query(collection(db, 'posts'), orderBy('postTime', 'desc'));

    const unsub = onSnapshot(q, (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Filter to tasks only
      data = data.filter(t => t.taskCapacity > 0);
      // Inner: show own tasks. Looper: show tasks they applied to
      if (isInner) {
        data = data.filter(t => t.authorID === user.uid);
      } else {
        data = data.filter(t => t.applicants?.some(a => a.uid === user.uid) || t.joinedUsers?.includes(user.uid));
      }
      setTasks(data);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user?.uid, isInner]);

  async function markComplete(taskId) {
    try {
      await updateDoc(doc(db, 'posts', taskId), { status: 'completed', completedAt: new Date() });
    } catch (err) { console.error(err); }
  }

  function timeAgo(ts) {
    if (!ts?.toDate) return 'recently';
    const diff = Math.floor((Date.now() - ts.toDate().getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <span className="font-display text-lg font-extrabold flex items-center gap-2">
            {isInner ? <Building2 size={18} className="text-loop-purple" /> : <Heart size={18} className="text-loop-red" />}
            {isInner ? 'My Posted Tasks' : 'My Applications'}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-loop-purple" /></div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-loop-purple/10 flex items-center justify-center"><Users size={28} className="text-loop-purple" /></div>
            <p className="font-display text-lg font-bold">No tasks yet</p>
            <p className="text-sm text-loop-green/40">{isInner ? 'Post a task from the feed' : 'Apply to a task from the feed'}</p>
            <button onClick={() => navigate('/feed')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-loop-green text-white text-sm font-semibold">Go to Feed</button>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} isInner={isInner}
              isExpanded={expandedTask === task.id}
              onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              onMarkComplete={() => markComplete(task.id)}
              onReview={(uid, name, hrs, wl) => setReviewTarget({ userId: uid, userName: name, hoursReward: hrs, wasWaitlisted: wl })}
              timeAgo={timeAgo} currentUserId={user?.uid} />
          ))
        )}
      </div>

      {reviewTarget && (
        <ReviewModal onClose={() => setReviewTarget(null)}
          reviewedUserID={reviewTarget.userId} reviewedUserName={reviewTarget.userName}
          hoursForTask={reviewTarget.hoursReward} wasWaitlisted={reviewTarget.wasWaitlisted} />
      )}
    </div>
  );
}

/* ─── Task Card ────────────────────────── */
function TaskCard({ task, isInner, isExpanded, onToggle, onMarkComplete, onReview, timeAgo, currentUserId }) {
  const toast = useToast();
  const isComplete = task.status === 'completed';
  const isFull = (task.taskFilled || 0) >= task.taskCapacity;
  const fillPct = Math.min(100, ((task.taskFilled || 0) / task.taskCapacity) * 100);
  const pendingApplicants = task.applicants?.filter(a => a.status === 'pending') || [];
  const acceptedApplicants = task.applicants?.filter(a => a.status === 'accepted') || [];
  const myApp = !isInner ? task.applicants?.find(a => a.uid === currentUserId) : null;

  async function handleAccept(applicant) {
    try {
      const ref = doc(db, 'posts', task.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      const updatedApplicants = (data.applicants || []).map(a =>
        a.uid === applicant.uid ? { ...a, status: 'accepted' } : a
      );
      const updatedJoined = [...(data.joinedUsers || [])];
      if (!updatedJoined.includes(applicant.uid)) updatedJoined.push(applicant.uid);
      await updateDoc(ref, {
        applicants: updatedApplicants,
        joinedUsers: updatedJoined,
        taskFilled: (data.taskFilled || 0) + 1,
      });
      toast.success(`Accepted ${applicant.name}!`);
    } catch (err) {
      toast.error('Failed to accept.');
    }
  }

  async function handleReject(applicant) {
    try {
      const ref = doc(db, 'posts', task.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      const updatedApplicants = (data.applicants || []).map(a =>
        a.uid === applicant.uid ? { ...a, status: 'rejected' } : a
      );
      await updateDoc(ref, { applicants: updatedApplicants });
      toast.info(`Declined ${applicant.name}`);
    } catch (err) {
      toast.error('Failed to update.');
    }
  }

  return (
    <div className={`bg-white rounded-2xl border transition-all ${isComplete ? 'border-green-200 bg-green-50/30' : 'border-loop-gray/50'}`}>
      <button onClick={onToggle} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isComplete && <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />}
              <p className="font-semibold text-sm truncate">{task.content?.slice(0, 70)}...</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-loop-green/40">
              <span className="flex items-center gap-1"><Users size={10} /> {task.taskFilled || 0}/{task.taskCapacity}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> +{task.hoursReward}h</span>
              {task.schedule?.startDate?.toDate && (
                <span className="flex items-center gap-1 text-loop-purple font-semibold">
                  {task.schedule.startDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {task.schedule.startTime && ` ${fmtClock(task.schedule.startTime)}`}
                  {task.schedule.endDate?.toDate && ` → ${task.schedule.endDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </span>
              )}
              {task.schedule?.ongoing && (
                <span className="text-loop-purple font-semibold">Ongoing</span>
              )}
              <span>{timeAgo(task.postTime)}</span>
              {isInner && pendingApplicants.length > 0 && (
                <span className="text-loop-purple font-semibold">{pendingApplicants.length} pending</span>
              )}
            </div>
          </div>
          {isExpanded ? <ChevronUp size={16} className="text-loop-green/30" /> : <ChevronDown size={16} className="text-loop-green/30" />}
        </div>
        <div className="mt-2 h-1.5 bg-loop-gray rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : isFull ? 'bg-loop-red' : 'bg-gradient-to-r from-loop-purple to-loop-red'}`}
            style={{ width: `${fillPct}%` }} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-loop-gray/30 pt-3">
          <p className="text-sm text-loop-green/70 leading-relaxed whitespace-pre-wrap">{task.content}</p>

          {task.requirements?.length > 0 && (
            <div className="p-3 rounded-xl bg-loop-purple/5 border border-loop-purple/10">
              <p className="text-[10px] font-semibold text-loop-purple mb-1.5 flex items-center gap-1"><ClipboardCheck size={10} /> REQUIREMENTS</p>
              <div className="flex flex-wrap gap-1.5">
                {task.requirements.map((r, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-white text-[10px] border border-loop-purple/10">{r}</span>)}
              </div>
            </div>
          )}

          {/* INNER VIEW: Applicants list */}
          {isInner && (
            <div className="space-y-3">
              {/* Pending */}
              {pendingApplicants.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-loop-green/50 uppercase tracking-wide mb-2">Pending Applications ({pendingApplicants.length})</p>
                  {pendingApplicants.map(app => (
                    <ApplicantCard key={app.uid} app={app} requirements={task.requirements} onAccept={() => handleAccept(app)} onReject={() => handleReject(app)} />
                  ))}
                </div>
              )}

              {/* Accepted */}
              {acceptedApplicants.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Accepted ({acceptedApplicants.length})</p>
                  {acceptedApplicants.map(app => (
                    <div key={app.uid} className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 size={14} className="text-green-600" /></div>
                        <div>
                          <p className="text-sm font-medium">{app.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-loop-green/40">
                            {app.starRating && <span>⭐ {app.starRating}</span>}
                            <span>{app.verifiedHours || 0}h verified</span>
                          </div>
                        </div>
                      </div>
                      {isComplete && (
                        <button onClick={e => { e.stopPropagation(); onReview(app.uid, app.name, task.hoursReward, task.waitlist?.includes(app.uid)); }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-loop-purple text-white text-xs font-semibold"><Star size={10} /> Review</button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {pendingApplicants.length === 0 && acceptedApplicants.length === 0 && (
                <p className="text-sm text-loop-green/40 text-center py-4">No applications yet</p>
              )}
            </div>
          )}

          {/* LOOPER VIEW: My application status */}
          {!isInner && myApp && (
            <div className={`p-4 rounded-xl text-center ${
              myApp.status === 'accepted' ? 'bg-green-50 border border-green-200' :
              myApp.status === 'rejected' ? 'bg-loop-gray/30 border border-loop-gray/50' :
              'bg-loop-blue/10 border border-loop-blue/20'
            }`}>
              {myApp.status === 'accepted' ? (
                <p className="text-sm font-semibold text-green-700 flex items-center justify-center gap-2"><CheckCircle2 size={16} /> You've been accepted!</p>
              ) : myApp.status === 'rejected' ? (
                <p className="text-sm text-loop-green/50 flex items-center justify-center gap-2"><X size={16} /> Not selected this time</p>
              ) : (
                <p className="text-sm text-loop-green/50 flex items-center justify-center gap-2"><Clock size={16} /> Application pending — waiting for organizer review</p>
              )}
              {myApp.metRequirements?.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {myApp.metRequirements.map((r, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-white text-[10px]">✓ {r}</span>)}
                </div>
              )}
            </div>
          )}

          {/* Mark complete */}
          {isInner && !isComplete && acceptedApplicants.length > 0 && (
            <button onClick={e => { e.stopPropagation(); onMarkComplete(); }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all">
              <CheckCircle2 size={16} /> Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Applicant Card (for Inner view) ─── */
function ApplicantCard({ app, requirements, onAccept, onReject }) {
  const hasAllReqs = !requirements?.length || app.metRequirements?.length === requirements.length;
  const metCount = app.metRequirements?.length || 0;
  const totalReqs = requirements?.length || 0;

  return (
    <div className="p-3 rounded-xl border border-loop-gray/50 mb-2 space-y-2">
      {/* Applicant header */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-loop-red/15 flex items-center justify-center"><Heart size={14} className="text-loop-red" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{app.name}</p>
          <div className="flex items-center gap-2 text-[10px] text-loop-green/40">
            {app.starRating && <span>⭐ {app.starRating}</span>}
            <span>{app.verifiedHours || 0}h verified</span>
            {app.tags?.length > 0 && app.tags.slice(0, 3).map(t => <span key={t}>#{t}</span>)}
          </div>
        </div>
      </div>

      {/* Requirements match */}
      {totalReqs > 0 && (
        <div className={`p-2 rounded-lg text-xs ${hasAllReqs ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
          <span className="font-semibold">{metCount}/{totalReqs} requirements met</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {requirements.map((req, i) => {
              const met = app.metRequirements?.includes(req);
              return (
                <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] ${met ? 'bg-green-200/50' : 'bg-red-200/50 line-through opacity-50'}`}>
                  {met ? '✓' : '✗'} {req}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Note */}
      {app.note && (
        <div className="p-2 rounded-lg bg-loop-gray/30 text-xs text-loop-green/60 flex items-start gap-1.5">
          <MessageSquare size={10} className="flex-shrink-0 mt-0.5" /> {app.note}
        </div>
      )}

      {/* Accept / Reject */}
      <div className="flex gap-2">
        <button onClick={e => { e.stopPropagation(); onAccept(); }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-all">
          <UserCheck size={13} /> Accept
        </button>
        <button onClick={e => { e.stopPropagation(); onReject(); }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-loop-gray text-loop-green/60 text-xs font-semibold hover:bg-loop-red/10 hover:text-loop-red transition-all">
          <UserX size={13} /> Decline
        </button>
      </div>
    </div>
  );
}

function fmtClock(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}
