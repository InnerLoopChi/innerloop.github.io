import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Star,
  Clock,
  Coins,
  Heart,
  Building2,
  Shield,
  MapPin,
  ArrowLeft,
  Edit3,
  Check,
  X,
  Loader2,
  Sparkles,
  User,
  Hash,
  Award,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(profile?.tags || []);
  const [savingTags, setSavingTags] = useState(false);

  const isInner = profile?.role === 'Inner';

  // Load reviews for this user
  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(collection(db, 'reviews'), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const mine = all.filter(r => r.reviewedID === user.uid);
      mine.sort((a, b) => {
        const ta = a.createdAt?.toDate?.() || new Date();
        const tb = b.createdAt?.toDate?.() || new Date();
        return tb - ta;
      });
      setReviews(mine);
      setLoadingReviews(false);
    }, () => setLoadingReviews(false));

    return unsub;
  }, [user?.uid]);

  // Save tags
  async function saveTags() {
    if (!user?.uid) return;
    setSavingTags(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { tags });
      setEditingTags(false);
    } catch (err) {
      console.error('Save tags error:', err);
    } finally {
      setSavingTags(false);
    }
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (tag && !tags.includes(tag) && tags.length < 8) {
      setTags([...tags, tag]);
      setTagInput('');
    }
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

  // Star display helper
  function StarDisplay({ rating, size = 16 }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-loop-gray'}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate('/feed')}
            className="flex items-center gap-1.5 text-sm font-medium text-loop-green/60 hover:text-loop-green transition-colors"
          >
            <ArrowLeft size={18} /> Feed
          </button>
          <span className="font-display text-lg font-extrabold text-loop-green">
            Profile
          </span>
          <div className="w-16" /> {/* spacer */}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-loop-gray/50 overflow-hidden">
          {/* Banner gradient */}
          <div className={`h-24 ${
            isInner
              ? 'bg-gradient-to-r from-loop-purple/30 via-loop-purple/20 to-loop-blue/20'
              : 'bg-gradient-to-r from-loop-red/30 via-loop-red/20 to-loop-blue/20'
          }`} />

          <div className="px-6 pb-6 -mt-10">
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center ${
              isInner
                ? 'bg-gradient-to-br from-loop-purple to-loop-purple/80'
                : 'bg-gradient-to-br from-loop-red to-loop-red/80'
            }`}>
              {isInner
                ? <Building2 size={32} className="text-white" />
                : <Heart size={32} className="text-white" />
              }
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{profile?.name}</h1>
                {profile?.isVerified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-loop-purple/10 text-loop-purple text-xs font-semibold">
                    <Shield size={10} /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-loop-green/50">
                {isInner ? 'Inner (Organization)' : 'Looper (Personal)'}
              </p>
            </div>

            {/* Tags */}
            <div className="mt-4">
              {editingTags ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-loop-purple/20 bg-loop-gray/20 min-h-[44px]">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-loop-blue/20 text-xs font-medium">
                        #{tag}
                        <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-loop-green/40 hover:text-loop-red">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {tags.length < 8 && (
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add tag..."
                        className="flex-1 min-w-[100px] bg-transparent text-sm placeholder:text-loop-green/30 focus:outline-none"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveTags} disabled={savingTags} className="flex items-center gap-1 px-4 py-2 rounded-full bg-loop-green text-white text-xs font-semibold">
                      {savingTags ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                    </button>
                    <button onClick={() => { setEditingTags(false); setTags(profile?.tags || []); }} className="flex items-center gap-1 px-4 py-2 rounded-full bg-loop-gray text-xs font-semibold">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  {(profile?.tags || []).length > 0 ? (
                    <>
                      {profile.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-loop-blue/15 text-xs font-medium text-loop-green/70 border border-loop-blue/15">
                          #{tag}
                        </span>
                      ))}
                    </>
                  ) : (
                    <span className="text-sm text-loop-green/30">No tags yet</span>
                  )}
                  <button onClick={() => setEditingTags(true)} className="p-1.5 rounded-lg hover:bg-loop-gray transition-colors">
                    <Edit3 size={14} className="text-loop-green/40" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loop Wallet */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold flex items-center gap-2 px-1">
            <Award size={18} className="text-loop-purple" />
            Loop Wallet
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {/* Star Rating */}
            <div className="bg-white rounded-2xl border border-loop-gray/50 p-5 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-yellow-50 flex items-center justify-center">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-2xl font-bold">
                {profile?.starRating ? profile.starRating.toFixed(1) : '\u2014'}
              </p>
              <p className="text-xs text-loop-green/40">Star Rating</p>
              {profile?.starRating && <StarDisplay rating={profile.starRating} size={12} />}
            </div>

            {/* Verified Hours */}
            <div className="bg-white rounded-2xl border border-loop-gray/50 p-5 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-loop-blue/15 flex items-center justify-center">
                <Clock size={20} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{profile?.verifiedHours || 0}</p>
              <p className="text-xs text-loop-green/40">Verified Hours</p>
            </div>

            {/* Loop Credits */}
            <div className="bg-white rounded-2xl border border-loop-gray/50 p-5 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-loop-red/10 flex items-center justify-center">
                <Coins size={20} className="text-loop-red" />
              </div>
              <p className="text-2xl font-bold">{profile?.loopCredits || 0}</p>
              <p className="text-xs text-loop-green/40">Loop Credits</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold flex items-center gap-2 px-1">
            <Sparkles size={18} className="text-loop-purple" />
            Recent Reviews
            {reviews.length > 0 && (
              <span className="text-sm font-normal text-loop-green/40">({reviews.length})</span>
            )}
          </h2>

          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-loop-purple" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-loop-gray/50 p-8 text-center">
              <Sparkles size={24} className="text-loop-green/20 mx-auto mb-3" />
              <p className="text-sm text-loop-green/40">No reviews yet. Complete tasks to earn reviews!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-loop-gray/50 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <StarDisplay rating={review.rating} />
                    <span className="text-xs text-loop-green/30">
                      {review.createdAt?.toDate?.()
                        ? review.createdAt.toDate().toLocaleDateString()
                        : 'Recent'
                      }
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-loop-green/70 leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-loop-green/40">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> +{review.hoursVerified} hrs verified
                    </span>
                    {review.wasWaitlisted && (
                      <span className="flex items-center gap-1 text-loop-red font-semibold">
                        <Zap size={11} /> 2\u00d7 waitlist bonus
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings & Sign Out */}
        <div className="pt-4 pb-8 space-y-3">
          <button
            onClick={() => navigate('/settings')}
            className="w-full py-3 rounded-xl bg-white border border-loop-gray/50 text-loop-green/70 text-sm font-semibold
              hover:bg-loop-gray/30 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 size={14} /> Account Settings
          </button>
          <button
            onClick={async () => { await logout(); navigate('/'); }}
            className="w-full py-3 rounded-xl border border-loop-red/20 text-loop-red text-sm font-semibold
              hover:bg-loop-red/5 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
