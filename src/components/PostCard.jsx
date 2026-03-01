import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import {
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Heart,
  Building2,
  Shield,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Zap,
  Check,
  Loader2,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';

export default function PostCard({ post, currentUser }) {
  const [joining, setJoining] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const isTask = post.taskCapacity != null && post.taskCapacity > 0;
  const isFull = isTask && (post.taskFilled || 0) >= post.taskCapacity;
  const isOnWaitlist = post.waitlist?.includes(currentUser?.id);
  const isAuthor = post.authorID === currentUser?.id;
  const isInnerPost = post.authorRole === 'Inner';

  // Check if current user has already joined this task
  const hasJoined = post.joinedUsers?.includes(currentUser?.id);

  // Format timestamp
  const timeAgo = post.postTime?.toDate
    ? formatTimeAgo(post.postTime.toDate())
    : 'just now';

  // Join a task
  async function handleJoinTask() {
    if (!currentUser?.id || isAuthor || hasJoined) return;
    setJoining(true);
    try {
      const ref = doc(db, 'posts', post.id);
      if (isFull) {
        await updateDoc(ref, {
          waitlist: arrayUnion(currentUser.id),
        });
        toast.reward('Joined waitlist! You\'ll earn 2× rewards if a spot opens.');
      } else {
        await updateDoc(ref, {
          taskFilled: increment(1),
          joinedUsers: arrayUnion(currentUser.id),
        });
        toast.success('You\'ve joined this task!');
      }
    } catch (err) {
      console.error('Join error:', err);
      toast.error('Failed to join. Please try again.');
    } finally {
      setJoining(false);
    }
  }

  // Leave waitlist
  async function handleLeaveWaitlist() {
    if (!currentUser?.id) return;
    setJoining(true);
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        waitlist: arrayRemove(currentUser.id),
      });
    } catch (err) {
      console.error('Leave waitlist error:', err);
    } finally {
      setJoining(false);
    }
  }

  // Delete own post
  async function handleDelete() {
    if (!isAuthor) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('Post deleted.');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete post.');
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-loop-gray/50 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Author header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isInnerPost
            ? 'bg-gradient-to-br from-loop-purple/25 to-loop-purple/10'
            : 'bg-gradient-to-br from-loop-red/20 to-loop-red/5'
        }`}>
          {isInnerPost
            ? <Building2 size={18} className="text-loop-purple" />
            : <Heart size={18} className="text-loop-red" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{post.authorName}</p>
          <p className="text-xs text-loop-green/40 flex items-center gap-1">
            {isInnerPost && <Shield size={10} className="text-loop-purple" />}
            {post.authorRole}
            <span className="mx-1">·</span>
            {timeAgo}
          </p>
        </div>

        {/* Inner Only badge */}
        {post.isInnerOnly && (
          <span className="px-2.5 py-1 rounded-full bg-loop-purple/10 text-loop-purple text-xs font-semibold flex items-center gap-1">
            <Shield size={10} /> Inner Only
          </span>
        )}

        {/* Author menu */}
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full hover:bg-loop-gray flex items-center justify-center transition-colors"
            >
              <MoreHorizontal size={16} className="text-loop-green/40" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-loop-gray/50 py-1 min-w-[140px] animate-fadeIn">
                  <button
                    onClick={() => { setShowMenu(false); handleDelete(); }}
                    disabled={deleting}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-loop-red hover:bg-loop-red/5 transition-colors"
                  >
                    <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Post'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-loop-green/80 mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-loop-blue/15 text-loop-green/70 border border-loop-blue/15"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Task capacity section */}
      {isTask && (
        <div className="mb-4 p-4 rounded-xl bg-loop-gray/40 space-y-3">
          {/* Privacy: only show your own status, not other Loopers' details */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-loop-green/50 flex items-center gap-1">
              <Users size={12} />
              {post.taskFilled || 0} of {post.taskCapacity} spots filled
            </span>
            {isFull ? (
              <span className="text-loop-red font-semibold flex items-center gap-1">
                <Clock size={12} /> Full — waitlist open
              </span>
            ) : (
              <span className="text-loop-green/60 font-medium">
                {post.taskCapacity - (post.taskFilled || 0)} left
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-loop-red'
                  : 'bg-gradient-to-r from-loop-purple to-loop-red'
              }`}
              style={{ width: `${Math.min(100, ((post.taskFilled || 0) / post.taskCapacity) * 100)}%` }}
            />
          </div>

          {/* Waitlist count */}
          {isFull && post.waitlist?.length > 0 && (
            <p className="text-xs text-loop-green/40 flex items-center gap-1">
              <Zap size={11} className="text-loop-red" />
              {post.waitlist.length} on waitlist — 2× rewards if a spot opens
            </p>
          )}

          {/* Action button */}
          {!isAuthor && (
            <div>
              {hasJoined ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-loop-green/60">
                  <Check size={16} className="text-green-600" />
                  You've joined this task
                </div>
              ) : isOnWaitlist ? (
                <button
                  onClick={handleLeaveWaitlist}
                  disabled={joining}
                  className="flex items-center gap-2 text-sm font-semibold text-loop-red hover:underline"
                >
                  {joining ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  Leave Waitlist
                </button>
              ) : (
                <button
                  onClick={handleJoinTask}
                  disabled={joining}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300
                    ${isFull
                      ? 'bg-loop-red hover:shadow-md hover:shadow-loop-red/20'
                      : 'bg-loop-green hover:shadow-md hover:shadow-loop-green/20'
                    }
                    ${joining ? 'opacity-60' : 'hover:scale-105 active:scale-95'}
                  `}
                >
                  {joining ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isFull ? (
                    <>
                      <Zap size={14} /> Join Waitlist (2× rewards)
                    </>
                  ) : (
                    <>
                      <ArrowRight size={14} /> Join Task
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer: hours reward hint */}
      {isTask && post.hoursReward && (
        <div className="flex items-center justify-between text-xs text-loop-green/40 pt-2 border-t border-loop-gray/50">
          <span className="flex items-center gap-1">
            <Clock size={11} /> +{post.hoursReward} verified hours
          </span>
          {post.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} /> Nearby
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Time formatting helper ─────────────────────── */
function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}
