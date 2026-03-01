import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { doc, updateDoc, deleteDoc, getDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Heart, Building2, Shield, Clock, Users, ArrowRight, Zap,
  Check, Loader2, Trash2, MoreHorizontal, ClipboardCheck, X, CheckCircle2, CalendarDays, Timer,
} from 'lucide-react';

export default function PostCard({ post, currentUser }) {
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const toast = useToast();

  const isTask = post.taskCapacity != null && post.taskCapacity > 0;
  const isFull = isTask && (post.taskFilled || 0) >= post.taskCapacity;
  const isAuthor = post.authorID === currentUser?.id;
  const isInnerPost = post.authorRole === 'Inner';
  const timeAgo = post.postTime?.toDate ? fmtTime(post.postTime.toDate()) : 'just now';

  // Application status
  const myApp = post.applicants?.find(a => a.uid === currentUser?.id);
  const hasJoined = post.joinedUsers?.includes(currentUser?.id);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('Deleted.');
    } catch { toast.error('Failed.'); setDeleting(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-loop-gray/50 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isInnerPost ? 'bg-loop-purple/15' : 'bg-loop-red/15'}`}>
          {isInnerPost ? <Building2 size={18} className="text-loop-purple" /> : <Heart size={18} className="text-loop-red" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{post.authorName}</p>
          <p className="text-xs text-loop-green/40">{post.authorRole} · {timeAgo}</p>
        </div>
        {post.isInnerOnly && <span className="px-2 py-0.5 rounded-full bg-loop-purple/10 text-loop-purple text-[10px] font-semibold">Inner</span>}
        {isAuthor && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-full hover:bg-loop-gray flex items-center justify-center">
              <MoreHorizontal size={16} className="text-loop-green/40" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border py-1 min-w-[130px]">
                  <button onClick={() => { setShowMenu(false); handleDelete(); }} disabled={deleting}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-loop-red hover:bg-loop-red/5">
                    <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-loop-green/80 mb-3 whitespace-pre-wrap">{post.content}</p>

      {/* Requirements */}
      {isTask && post.requirements?.length > 0 && (
        <div className="mb-3 p-2.5 rounded-xl bg-loop-purple/5 border border-loop-purple/10">
          <p className="text-[10px] font-semibold text-loop-purple mb-1 flex items-center gap-1"><ClipboardCheck size={10} /> REQUIREMENTS</p>
          <div className="flex flex-wrap gap-1">
            {post.requirements.map((r, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-white text-[10px] border border-loop-purple/10">{r}</span>)}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-loop-blue/15 border border-loop-blue/10">#{tag}</span>)}
        </div>
      )}

      {/* Schedule */}
      {post.schedule && !post.schedule.ongoing && post.schedule.startDate && (
        <div className="mb-3 flex items-center gap-2 text-xs text-loop-green/60">
          <CalendarDays size={12} className="text-loop-purple flex-shrink-0" />
          <span className="font-medium">
            {fmtDate(post.schedule.startDate)}
            {post.schedule.endDate && ` → ${fmtDate(post.schedule.endDate)}`}
          </span>
          {(post.schedule.startTime || post.schedule.endTime) && (
            <span className="text-loop-green/40">
              {post.schedule.startTime && fmtClock(post.schedule.startTime)}
              {post.schedule.startTime && post.schedule.endTime && ' – '}
              {post.schedule.endTime && fmtClock(post.schedule.endTime)}
            </span>
          )}
        </div>
      )}
      {post.schedule?.ongoing && (
        <div className="mb-3 flex items-center gap-2 text-xs text-loop-green/50">
          <Timer size={12} className="text-loop-purple" /> <span className="font-medium">Ongoing — no fixed date</span>
        </div>
      )}

      {/* Task section */}
      {isTask && (
        <div className="p-3 rounded-xl bg-loop-gray/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-loop-green/50 flex items-center gap-1"><Users size={11} /> {post.taskFilled || 0}/{post.taskCapacity} filled</span>
            <span className="flex items-center gap-1"><Clock size={11} /> +{post.hoursReward}h</span>
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${isFull ? 'bg-loop-red' : 'bg-gradient-to-r from-loop-purple to-loop-red'}`}
              style={{ width: `${Math.min(100, ((post.taskFilled || 0) / post.taskCapacity) * 100)}%` }} />
          </div>

          {/* Author sees pending count */}
          {isAuthor && post.applicants?.filter(a => a.status === 'pending').length > 0 && (
            <p className="text-xs font-semibold text-loop-purple">{post.applicants.filter(a => a.status === 'pending').length} pending applications → Tasks tab</p>
          )}

          {/* Non-author actions */}
          {!isAuthor && (
            <div className="pt-1">
              {myApp?.status === 'accepted' || hasJoined ? (
                <p className="text-sm font-semibold text-green-600 flex items-center gap-1.5"><CheckCircle2 size={15} /> Accepted!</p>
              ) : myApp?.status === 'rejected' ? (
                <p className="text-sm text-loop-green/40">Not selected</p>
              ) : myApp?.status === 'pending' ? (
                <p className="text-sm font-semibold text-loop-purple flex items-center gap-1.5"><Clock size={15} /> Application pending</p>
              ) : (
                <button onClick={() => setShowApply(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105
                    ${isFull ? 'bg-loop-red' : 'bg-loop-green'}`}>
                  {isFull ? <><Zap size={14} /> Waitlist (2×)</> : <><ArrowRight size={14} /> Apply</>}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {showApply && <ApplyModal post={post} currentUser={currentUser} isFull={isFull} onClose={() => setShowApply(false)} />}
    </div>
  );
}

/* ─── Apply Modal ─── */
function ApplyModal({ post, currentUser, isFull, onClose }) {
  const toast = useToast();
  const [checkedReqs, setCheckedReqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const hasReqs = post.requirements?.length > 0;

  function toggleReq(req) {
    setCheckedReqs(prev => prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]);
  }

  async function handleApply() {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const ref = doc(db, 'posts', post.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) { toast.error('Post not found.'); return; }
      const data = snap.data();
      
      // Check if already applied
      if (data.applicants?.some(a => a.uid === currentUser.id)) {
        toast.error('You already applied.');
        onClose();
        return;
      }

      const applicant = {
        uid: currentUser.id,
        name: currentUser.name || 'Anonymous',
        role: currentUser.role || 'Looper',
        metRequirements: checkedReqs,
        note: note.trim(),
        status: 'pending',
        appliedAt: new Date().toISOString(),
        tags: currentUser.tags || [],
        starRating: currentUser.starRating || null,
        verifiedHours: currentUser.verifiedHours || 0,
      };

      const updatedApplicants = [...(data.applicants || []), applicant];
      const updates = { applicants: updatedApplicants };
      
      if (isFull) {
        const updatedWaitlist = [...(data.waitlist || [])];
        if (!updatedWaitlist.includes(currentUser.id)) updatedWaitlist.push(currentUser.id);
        updates.waitlist = updatedWaitlist;
      }
      
      await updateDoc(ref, updates);
      toast.success(isFull ? 'Waitlisted! 2× rewards if accepted.' : 'Applied! Organizer will review.');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply.');
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-loop-green/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-loop-gray/50 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-display text-lg font-bold">{isFull ? 'Join Waitlist' : 'Apply'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Task info */}
          <div className="p-3 rounded-xl bg-loop-gray/30">
            <p className="text-sm font-semibold">{post.authorName}</p>
            <p className="text-xs text-loop-green/60 mt-1 line-clamp-2">{post.content}</p>
            <div className="flex gap-3 mt-2 text-xs text-loop-green/40">
              <span><Users size={10} className="inline" /> {post.taskFilled || 0}/{post.taskCapacity}</span>
              <span><Clock size={10} className="inline" /> +{post.hoursReward}h</span>
            </div>
          </div>

          {/* Requirements */}
          {hasReqs && (
            <div>
              <p className="text-sm font-semibold mb-2">Check what applies to you:</p>
              {post.requirements.map((req, i) => {
                const on = checkedReqs.includes(req);
                return (
                  <button key={i} type="button" onClick={() => toggleReq(req)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-1.5 text-left transition-all ${on ? 'border-loop-purple bg-loop-purple/5' : 'border-loop-gray/50'}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${on ? 'bg-loop-purple border-loop-purple' : 'border-loop-green/20'}`}>
                      {on && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm">{req}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-xs font-medium mb-1">Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={200} rows={2}
              placeholder="Anything the organizer should know..."
              className="w-full px-3 py-2 rounded-xl border border-loop-gray text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20 resize-none" />
          </div>

          {/* Your profile */}
          <div className="p-3 rounded-xl bg-loop-blue/5 border border-loop-blue/10 text-xs">
            <p className="font-semibold text-loop-green/40 mb-1">YOUR PROFILE</p>
            <p className="text-sm font-semibold">{currentUser?.name}</p>
            <div className="flex gap-2 text-loop-green/50 mt-0.5">
              {currentUser?.starRating && <span>⭐ {currentUser.starRating}</span>}
              <span>{currentUser?.verifiedHours || 0}h verified</span>
            </div>
          </div>

          <button onClick={handleApply} disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all
              ${isFull ? 'bg-loop-red' : 'bg-loop-green'} ${loading ? 'opacity-60' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
            {loading ? <Loader2 size={18} className="animate-spin" /> :
              isFull ? <><Zap size={16} /> Waitlist (2×)</> : <><ArrowRight size={16} /> Apply</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function fmtTime(d) {
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return d.toLocaleDateString();
}

function fmtDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtClock(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}
