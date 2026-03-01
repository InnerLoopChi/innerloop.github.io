import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import {
  MapPin,
  Plus,
  X,
  Sparkles,
  Loader2,
  Search,
  Lock,
} from 'lucide-react';

export default function FeedPage() {
  const { profile } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [innerOnly, setInnerOnly] = useState(false);
  const [searchTag, setSearchTag] = useState('');

  // Real-time feed listener
  useEffect(() => {
    let q;

    if (innerOnly && profile?.role === 'Inner' && profile?.isVerified) {
      // Inner Loop: only posts marked isInnerOnly
      q = query(
        collection(db, 'posts'),
        where('isInnerOnly', '==', true),
        orderBy('postTime', 'desc')
      );
    } else {
      // Public feed: exclude inner-only posts
      q = query(
        collection(db, 'posts'),
        where('isInnerOnly', '==', false),
        orderBy('postTime', 'desc')
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(data);
      setLoading(false);
    }, (err) => {
      console.error('Feed error:', err);
      setLoading(false);
    });

    return unsub;
  }, [innerOnly, profile]);

  // Filter by tag search
  const filtered = searchTag.trim()
    ? posts.filter((p) =>
        p.tags?.some((t) =>
          t.toLowerCase().includes(searchTag.toLowerCase())
        )
      )
    : posts;

  const isInner = profile?.role === 'Inner';
  const isVerifiedInner = isInner && profile?.isVerified;

  return (
    <div className="min-h-screen bg-loop-gray">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-xl font-extrabold text-loop-green">
            Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Inner Loop toggle — only for verified Inners */}
            {isVerifiedInner && (
              <button
                onClick={() => setInnerOnly(!innerOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  innerOnly
                    ? 'bg-loop-purple text-white shadow-md shadow-loop-purple/20'
                    : 'bg-loop-purple/10 text-loop-purple hover:bg-loop-purple/20'
                }`}
              >
                <Lock size={12} />
                Inner Loop
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Feed container */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                {innerOnly ? (
                  <>
                    <Lock size={20} className="text-loop-purple" />
                    Inner Loop
                  </>
                ) : (
                  <>
                    <MapPin size={20} className="text-loop-red" />
                    Local Feed
                  </>
                )}
              </h1>
              <p className="text-sm text-loop-green/40 mt-0.5">
                {innerOnly
                  ? 'Private feed for verified organizations'
                  : 'What\u2019s happening in your neighborhood'
                }
              </p>
            </div>

            {/* New Post button */}
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-loop-green text-white text-sm font-semibold
                shadow-md shadow-loop-green/15 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Post</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-loop-green/30" />
            <input
              type="text"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              placeholder="Search by tag... (e.g. volunteer, pilsen)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loop-gray bg-white
                text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2
                focus:ring-loop-purple/20 focus:border-loop-purple/20 transition-all"
            />
            {searchTag && (
              <button
                onClick={() => setSearchTag('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-loop-green/30 hover:text-loop-green/60"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-loop-purple" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-loop-purple/10 flex items-center justify-center">
              <Sparkles size={28} className="text-loop-purple" />
            </div>
            <div>
              <p className="font-display text-lg font-bold">
                {searchTag ? 'No posts match that tag' : 'No posts yet'}
              </p>
              <p className="text-sm text-loop-green/40 mt-1">
                {searchTag
                  ? 'Try a different search term'
                  : 'Be the first to post in your neighborhood!'
                }
              </p>
            </div>
            {!searchTag && (
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-loop-green text-white text-sm font-semibold"
              >
                <Plus size={16} /> Create First Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} currentUser={profile} />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreate && (
        <CreatePost
          onClose={() => setShowCreate(false)}
          isInnerOnly={innerOnly}
        />
      )}
    </div>
  );
}
