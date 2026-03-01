import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  X,
  Send,
  Hash,
  Users,
  Clock,
  Loader2,
  AlertCircle,
  Lock,
} from 'lucide-react';

const MIN_CHARS = 255;
const MAX_CHARS = 350;
const MAX_TAGS = 3;
const MAX_TAG_LEN = 20;

export default function CreatePost({ onClose, isInnerOnly = false }) {
  const { user, profile } = useAuth();
  const toast = useToast();

  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isTask, setIsTask] = useState(false);
  const [taskCapacity, setTaskCapacity] = useState(3);
  const [hoursReward, setHoursReward] = useState(1);
  const [innerPost, setInnerPost] = useState(isInnerOnly);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isInner = profile?.role === 'Inner';
  const isVerifiedInner = isInner && profile?.isVerified;
  const charCount = content.length;
  const tooShort = charCount > 0 && charCount < MIN_CHARS;
  const atLimit = charCount >= MAX_CHARS;

  function addTag() {
    let tag = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-]/g, '');
    if (tag.length > MAX_TAG_LEN) tag = tag.slice(0, MAX_TAG_LEN);
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  }

  function removeTag(t) {
    setTags(tags.filter(x => x !== t));
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  function handleContentChange(e) {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setContent(val);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmed = content.trim();
    if (!trimmed) return setError('Post content is required.');
    if (trimmed.length < MIN_CHARS) return setError(`Post must be at least ${MIN_CHARS} characters (currently ${trimmed.length}).`);

    try {
      setLoading(true);
      await addDoc(collection(db, 'posts'), {
        authorID: user.uid,
        authorName: profile?.name || 'Anonymous',
        authorRole: profile?.role || 'Looper',
        content: trimmed,
        tags,
        postTime: serverTimestamp(),
        isInnerOnly: innerPost,
        taskCapacity: isTask ? Number(taskCapacity) : null,
        taskFilled: isTask ? 0 : null,
        waitlist: isTask ? [] : null,
        joinedUsers: isTask ? [] : null,
        hoursReward: isTask ? Number(hoursReward) : null,
        location: null,
      });
      toast.success('Post published!');
      onClose();
    } catch (err) {
      console.error('Post error:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-loop-green/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-loop-gray/50 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-display text-lg font-bold">
            {innerPost ? 'Post to Inner Loop' : 'New Post'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center hover:bg-loop-gray/80 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-loop-red/10 border border-loop-red/20 flex items-start gap-2">
              <AlertCircle size={16} className="text-loop-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-loop-red">{error}</p>
            </div>
          )}

          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="What's happening in your neighborhood? (255-350 characters)"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-loop-gray bg-loop-gray/20
                text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2
                focus:ring-loop-purple/20 focus:border-loop-purple/20 transition-all resize-none"
            />
            <div className="flex items-center justify-between mt-1.5">
              {tooShort && (
                <p className="text-xs text-orange-500">
                  {MIN_CHARS - charCount} more characters needed
                </p>
              )}
              {!tooShort && charCount === 0 && (
                <p className="text-xs text-loop-green/30">Min {MIN_CHARS} characters</p>
              )}
              {!tooShort && charCount >= MIN_CHARS && (
                <p className="text-xs text-green-500">Good length!</p>
              )}
              <p className={`text-xs ml-auto ${atLimit ? 'text-loop-red font-semibold' : tooShort ? 'text-orange-500' : 'text-loop-green/30'}`}>
                {charCount}/{MAX_CHARS}
              </p>
            </div>
            {/* Character progress bar */}
            <div className="mt-1 h-1 bg-loop-gray rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  charCount >= MIN_CHARS ? 'bg-green-500' : charCount > 0 ? 'bg-orange-400' : 'bg-loop-gray'
                }`}
                style={{ width: `${Math.min(100, (charCount / MAX_CHARS) * 100)}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
              <Hash size={14} className="text-loop-green/40" />
              Tags <span className="text-loop-green/30 font-normal">(up to {MAX_TAGS}, max {MAX_TAG_LEN} chars each)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-loop-gray bg-loop-gray/20 min-h-[44px]">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-loop-blue/20 text-xs font-medium">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-loop-green/40 hover:text-loop-red transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {tags.length < MAX_TAGS && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value.slice(0, MAX_TAG_LEN))}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => { if (tagInput.trim()) addTag(); }}
                  placeholder={tags.length === 0 ? 'Type tag + Enter...' : 'Add more...'}
                  className="flex-1 min-w-[100px] bg-transparent text-sm placeholder:text-loop-green/30 focus:outline-none"
                  maxLength={MAX_TAG_LEN}
                />
              )}
            </div>
            {tags.length >= MAX_TAGS && (
              <p className="text-xs text-loop-green/30 mt-1">Maximum {MAX_TAGS} tags reached</p>
            )}
          </div>

          {/* Task toggle */}
          <div className="p-4 rounded-xl bg-loop-gray/30 border border-loop-gray/50 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium flex items-center gap-2">
                <Users size={16} className="text-loop-purple" />
                This is a task with capacity
              </span>
              <div onClick={() => setIsTask(!isTask)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${isTask ? 'bg-loop-purple' : 'bg-loop-green/20'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isTask ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>

            {isTask && (
              <div className="space-y-4 pt-2 border-t border-loop-gray/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-loop-green/60 flex items-center gap-1">
                      <Users size={12} /> Capacity
                    </label>
                    <input type="number" min={1} max={50} value={taskCapacity}
                      onChange={e => setTaskCapacity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-loop-green/60 flex items-center gap-1">
                      <Clock size={12} /> Hours reward
                    </label>
                    <input type="number" min={0.5} max={24} step={0.5} value={hoursReward}
                      onChange={e => setHoursReward(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                  </div>
                </div>
                <p className="text-xs text-loop-green/40">
                  Waitlisted Loopers earn <strong className="text-loop-red">2× hours and credits</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Inner Only toggle */}
          {isVerifiedInner && (
            <label className="flex items-center justify-between p-4 rounded-xl bg-loop-purple/5 border border-loop-purple/10 cursor-pointer">
              <span className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="text-loop-purple" />
                Post to Inner Loop only
              </span>
              <div onClick={() => setInnerPost(!innerPost)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${innerPost ? 'bg-loop-purple' : 'bg-loop-green/20'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${innerPost ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </label>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || charCount < MIN_CHARS}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full
              font-semibold text-sm text-white transition-all duration-300
              ${innerPost ? 'bg-loop-purple' : 'bg-loop-green'}
              ${loading || charCount < MIN_CHARS ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> {innerPost ? 'Post to Inner Loop' : 'Post to Feed'}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
