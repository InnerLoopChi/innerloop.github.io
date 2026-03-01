import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { MapPin, Plus, X, Sparkles, Loader2, Search, Lock } from 'lucide-react';

export default function FeedPage() {
  const { profile } = useAuth();
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [innerOnly, setInnerOnly] = useState(false);
  const [searchTag, setSearchTag] = useState('');

  // ONE simple query — no where, no compound index needed
  useEffect(() => {
    // No orderBy, no where — just get ALL posts. Sort and filter client-side.
    // This avoids: composite index requirements, null postTime exclusion, security rule conflicts.
    const unsub = onSnapshot(collection(db, 'posts'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by postTime descending, null/pending timestamps go to top
      data.sort((a, b) => {
        const ta = a.postTime?.toDate?.() || new Date();
        const tb = b.postTime?.toDate?.() || new Date();
        return tb - ta;
      });
      setAllPosts(data);
      setLoading(false);
    }, err => {
      console.error('Feed error:', err);
      setLoading(false);
    });
    return unsub;
  }, []);

  const isInner = profile?.role === 'Inner';
  const isVerifiedInner = isInner && profile?.isVerified;

  // All filtering done client-side
  let posts = allPosts;
  if (innerOnly && isVerifiedInner) {
    posts = posts.filter(p => p.isInnerOnly === true);
  } else {
    posts = posts.filter(p => !p.isInnerOnly);
  }
  if (searchTag.trim()) {
    const term = searchTag.toLowerCase();
    posts = posts.filter(p => p.tags?.some(t => t.toLowerCase().includes(term)));
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-xl font-extrabold text-loop-green">
            Inner<span className="bg-gradient-to-r from-loop-purple to-loop-red bg-clip-text text-transparent">Loop</span>
          </Link>
          {isVerifiedInner && (
            <button onClick={() => setInnerOnly(!innerOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                innerOnly ? 'bg-loop-purple text-white shadow-md' : 'bg-loop-purple/10 text-loop-purple'}`}>
              <Lock size={12} /> Inner Loop
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                {innerOnly ? <><Lock size={20} className="text-loop-purple" /> Inner Loop</> : <><MapPin size={20} className="text-loop-red" /> Local Feed</>}
              </h1>
              <p className="text-sm text-loop-green/40 mt-0.5">{innerOnly ? 'Private feed for verified orgs' : 'What\u2019s happening in your neighborhood'}</p>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-loop-green text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all">
              <Plus size={16} /> <span className="hidden sm:inline">New Post</span>
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-loop-green/30" />
            <input type="text" value={searchTag} onChange={e => setSearchTag(e.target.value)} placeholder="Search by tag..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-loop-gray bg-white text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
            {searchTag && <button onClick={() => setSearchTag('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-loop-green/30"><X size={16} /></button>}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-loop-purple" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-loop-purple/10 flex items-center justify-center"><Sparkles size={28} className="text-loop-purple" /></div>
            <p className="font-display text-lg font-bold">{searchTag ? 'No posts match' : 'No posts yet'}</p>
            {!searchTag && <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-loop-green text-white text-sm font-semibold"><Plus size={16} /> Create Post</button>}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => <PostCard key={post.id} post={post} currentUser={profile} />)}
          </div>
        )}
      </div>

      {showCreate && <CreatePost onClose={() => setShowCreate(false)} isInnerOnly={innerOnly} />}
    </div>
  );
}
