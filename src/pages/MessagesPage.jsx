import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Building2,
  Shield,
  Search,
  X,
  Loader2,
  Plus,
  Check,
  CheckCheck,
} from 'lucide-react';

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isVerifiedInner = profile?.role === 'Inner' && profile?.isVerified;

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [inners, setInners] = useState([]);
  const [searchInner, setSearchInner] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Not a verified Inner — show access denied
  if (!isVerifiedInner) {
    return (
      <div className="min-h-screen bg-loop-gray flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-loop-gray/50 p-10 max-w-md text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-loop-purple/10 flex items-center justify-center">
            <Shield size={28} className="text-loop-purple" />
          </div>
          <h2 className="font-display text-xl font-bold">Inner Loop Only</h2>
          <p className="text-sm text-loop-green/50">
            Direct messaging is available exclusively to verified Inner accounts.
            {profile?.role === 'Inner' && !profile?.isVerified && ' Your account is pending verification.'}
          </p>
          <button onClick={() => navigate('/feed')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-loop-green text-white text-sm font-semibold">
            <ArrowLeft size={16} /> Back to Feed
          </button>
        </div>
      </div>
    );
  }

  // Load conversations
  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(collection(db, 'conversations'), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const mine = all.filter(c => c.participants?.includes(user.uid));
      mine.sort((a, b) => {
        const ta = a.lastMessageAt?.toDate?.() || new Date(0);
        const tb = b.lastMessageAt?.toDate?.() || new Date(0);
        return tb - ta;
      });
      setConversations(mine);
      setLoading(false);
    }, () => setLoading(false));

    return unsub;
  }, [user?.uid]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConvo) { setMessages([]); return; }

    const unsub = onSnapshot(collection(db, 'conversations', activeConvo.id, 'messages'), (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => {
        const ta = a.sentAt?.toDate?.() || new Date();
        const tb = b.sentAt?.toDate?.() || new Date();
        return ta - tb;
      });
      setMessages(msgs);
      // Auto-scroll to bottom
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    // Mark as read
    if (activeConvo.lastSenderID !== user.uid) {
      updateDoc(doc(db, 'conversations', activeConvo.id), {
        [`unread_${user.uid}`]: 0,
      }).catch(() => { });
    }

    return unsub;
  }, [activeConvo?.id]);

  // Load verified Inners for new conversation
  useEffect(() => {
    if (!showNewConvo) return;

    getDocs(collection(db, 'users')).then(snap => {
      const allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInners(allUsers
        .filter(u => u.role === 'Inner' && u.isVerified === true && u.id !== user.uid)
      );
    });
  }, [showNewConvo]);

  // Send message
  async function handleSend(e) {
    e.preventDefault();
    if (!newMsg.trim() || !activeConvo || sending) return;

    setSending(true);
    const text = newMsg.trim();
    setNewMsg('');

    try {
      // Add message to subcollection
      await addDoc(collection(db, 'conversations', activeConvo.id, 'messages'), {
        senderID: user.uid,
        senderName: profile.name,
        text,
        sentAt: Timestamp.now(),
      });

      // Update conversation metadata
      const otherID = activeConvo.participants.find(p => p !== user.uid);
      await updateDoc(doc(db, 'conversations', activeConvo.id), {
        lastMessage: text,
        lastMessageAt: Timestamp.now(),
        lastSenderID: user.uid,
        [`unread_${otherID}`]: (activeConvo[`unread_${otherID}`] || 0) + 1,
      });
    } catch (err) {
      console.error('Send error:', err);
      setNewMsg(text); // restore on failure
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  // Start new conversation
  async function startConvo(otherUser) {
    // Check if conversation already exists
    const existing = conversations.find(c =>
      c.participants.includes(otherUser.id)
    );

    if (existing) {
      setActiveConvo(existing);
      setShowNewConvo(false);
      return;
    }

    // Create new conversation
    const convoData = {
      participants: [user.uid, otherUser.id],
      participantNames: {
        [user.uid]: profile.name,
        [otherUser.id]: otherUser.name,
      },
      lastMessage: null,
      lastMessageAt: Timestamp.now(),
      lastSenderID: null,
      [`unread_${user.uid}`]: 0,
      [`unread_${otherUser.id}`]: 0,
      createdAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, 'conversations'), convoData);
      setActiveConvo({ id: docRef.id, ...convoData });
      setShowNewConvo(false);
    } catch (err) {
      console.error('Create convo error:', err);
    }
  }

  // Get other participant's name
  function getOtherName(convo) {
    const otherID = convo.participants?.find(p => p !== user.uid);
    return convo.participantNames?.[otherID] || 'Unknown';
  }

  function getUnread(convo) {
    return convo[`unread_${user.uid}`] || 0;
  }

  // Time formatting
  function formatTime(ts) {
    if (!ts?.toDate) return '';
    const d = ts.toDate();
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-loop-gray flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => activeConvo ? setActiveConvo(null) : navigate('/feed')} className="flex items-center gap-1.5 text-sm font-medium text-loop-green/60 hover:text-loop-green transition-colors">
            <ArrowLeft size={18} /> {activeConvo ? 'Back' : 'Feed'}
          </button>
          <span className="font-display text-lg font-extrabold flex items-center gap-2">
            <Shield size={16} className="text-loop-purple" />
            {activeConvo ? getOtherName(activeConvo) : 'Inner Loop DMs'}
          </span>
          {!activeConvo ? (
            <button onClick={() => setShowNewConvo(true)} className="w-9 h-9 rounded-full bg-loop-purple text-white flex items-center justify-center hover:shadow-md transition-all">
              <Plus size={16} />
            </button>
          ) : <div className="w-9" />}
        </div>
      </nav>

      {/* Content */}
      {!activeConvo ? (
        /* ─── Conversation List ─── */
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-loop-purple" /></div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-loop-purple/10 flex items-center justify-center">
                <MessageSquare size={28} className="text-loop-purple" />
              </div>
              <p className="font-display text-lg font-bold">No messages yet</p>
              <p className="text-sm text-loop-green/40">Start a conversation with another verified Inner.</p>
              <button onClick={() => setShowNewConvo(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-loop-purple text-white text-sm font-semibold">
                <Plus size={16} /> New Message
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map(convo => {
                const unread = getUnread(convo);
                return (
                  <button
                    key={convo.id}
                    onClick={() => setActiveConvo(convo)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-3 ${unread > 0 ? 'bg-white border-2 border-loop-purple/20 shadow-sm' : 'bg-white border border-loop-gray/50 hover:shadow-sm'
                      }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-loop-purple/25 to-loop-purple/10 flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-loop-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${unread > 0 ? 'font-bold' : 'font-semibold'}`}>
                          {getOtherName(convo)}
                        </p>
                        <span className="text-xs text-loop-green/30 flex-shrink-0 ml-2">
                          {formatTime(convo.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-xs truncate ${unread > 0 ? 'text-loop-green/70 font-medium' : 'text-loop-green/40'}`}>
                          {convo.lastMessage || 'No messages yet'}
                        </p>
                        {unread > 0 && (
                          <span className="ml-2 w-5 h-5 rounded-full bg-loop-purple text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ─── Chat Thread ─── */
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-sm text-loop-green/30 py-8">Start the conversation!</p>
            )}
            {messages.map((msg) => {
              const isMe = msg.senderID === user.uid;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMe
                      ? 'bg-loop-purple text-white rounded-br-md'
                      : 'bg-white border border-loop-gray/50 rounded-bl-md'
                    }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? 'text-white/50' : 'text-loop-green/30'}`}>
                      {formatTime(msg.sentAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="sticky bottom-0 bg-white border-t border-loop-gray/50 px-4 py-3">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-full border border-loop-gray bg-loop-gray/20 text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newMsg.trim() || sending}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${newMsg.trim() ? 'bg-loop-purple text-white hover:shadow-md' : 'bg-loop-gray text-loop-green/30'
                  }`}
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Conversation Modal */}
      {showNewConvo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-loop-green/40 backdrop-blur-sm" onClick={() => setShowNewConvo(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-fadeIn max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-loop-gray/50">
              <h2 className="font-display text-lg font-bold">New Message</h2>
              <button onClick={() => setShowNewConvo(false)} className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-loop-gray/30">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-loop-green/30" />
                <input
                  type="text"
                  value={searchInner}
                  onChange={e => setSearchInner(e.target.value)}
                  placeholder="Search organizations..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-loop-gray bg-loop-gray/20 text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20"
                  autoFocus
                />
              </div>
            </div>

            {/* Inner list */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {inners
                .filter(i => !searchInner || i.name.toLowerCase().includes(searchInner.toLowerCase()))
                .map(inner => (
                  <button
                    key={inner.id}
                    onClick={() => startConvo(inner)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-loop-purple/5 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-loop-purple/15 flex items-center justify-center">
                      <Building2 size={16} className="text-loop-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{inner.name}</p>
                      <p className="text-xs text-loop-green/40 flex items-center gap-1">
                        <Shield size={9} /> Verified Inner
                      </p>
                    </div>
                  </button>
                ))
              }
              {inners.length === 0 && (
                <p className="text-center text-sm text-loop-green/30 py-8">No other verified Inners found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
