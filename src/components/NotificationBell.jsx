/**
 * NotificationBell — Real-time notification dropdown
 * 
 * Listens to the notifications collection filtered by the current user.
 * Shows unread count badge and a dropdown with message previews,
 * DM requests, application updates, and more. Supports mark-all-read.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Bell, X, Star, MessageSquare, UserCheck, UserX, Send, Check } from 'lucide-react';

export default function NotificationBell() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!user?.uid) return;
        const unsub = onSnapshot(collection(db, 'notifications'), (snap) => {
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            const mine = all.filter(n => n.recipientId === user.uid);
            mine.sort((a, b) => {
                const ta = a.createdAt?.toDate?.() || new Date();
                const tb = b.createdAt?.toDate?.() || new Date();
                return tb - ta;
            });
            setNotifications(mine);
        });
        return unsub;
    }, [user?.uid]);

    // Close on outside click
    useEffect(() => {
        function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    async function markRead(notif) {
        if (!notif.read) {
            try {
                await updateDoc(doc(db, 'notifications', notif.id), { read: true });
            } catch (err) { console.error(err); }
        }
        if (notif.link) navigate(notif.link);
        setOpen(false);
    }

    async function markAllRead() {
        for (const n of notifications.filter(n => !n.read)) {
            try { await updateDoc(doc(db, 'notifications', n.id), { read: true }); } catch (e) { }
        }
    }

    function getIcon(type) {
        switch (type) {
            case 'review': return <Star size={14} className="text-yellow-500" />;
            case 'accepted': return <UserCheck size={14} className="text-green-500" />;
            case 'rejected': return <UserX size={14} className="text-loop-red" />;
            case 'application': return <Send size={14} className="text-loop-purple" />;
            case 'dm_request': return <MessageSquare size={14} className="text-loop-blue" />;
            case 'dm_accepted': return <Check size={14} className="text-green-500" />;
            case 'new_message': return <MessageSquare size={14} className="text-loop-purple" />;
            default: return <Bell size={14} className="text-loop-green/40" />;
        }
    }

    function timeAgo(ts) {
        if (!ts?.toDate) return '';
        const diff = Math.floor((Date.now() - ts.toDate().getTime()) / 1000);
        if (diff < 60) return 'now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}d`;
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 rounded-full bg-loop-gray/50 flex items-center justify-center hover:bg-loop-gray transition-all"
            >
                <Bell size={18} className="text-loop-green/60" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-loop-red text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white rounded-2xl shadow-2xl border border-loop-gray/50 overflow-hidden z-50 animate-fadeIn">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-loop-gray/30">
                        <h3 className="font-display text-sm font-bold">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-loop-purple font-semibold hover:underline">
                                    Mark all read
                                </button>
                            )}
                            <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-loop-gray flex items-center justify-center">
                                <X size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-80">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-loop-green/30">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(n => (
                                <button
                                    key={n.id}
                                    onClick={() => markRead(n)}
                                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-loop-gray/30 transition-colors border-b border-loop-gray/10 ${!n.read ? 'bg-loop-purple/5' : ''}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-loop-gray/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs leading-relaxed ${!n.read ? 'font-semibold text-loop-green' : 'text-loop-green/60'}`}>
                                            {n.message}
                                        </p>
                                        <p className="text-[10px] text-loop-green/30 mt-0.5">{timeAgo(n.createdAt)}</p>
                                    </div>
                                    {!n.read && (
                                        <div className="w-2 h-2 rounded-full bg-loop-purple flex-shrink-0 mt-2" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
