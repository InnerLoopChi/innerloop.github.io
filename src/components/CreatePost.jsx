import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  X, Send, Hash, Users, Clock, Loader2, AlertCircle, Lock, Plus,
  ClipboardCheck, CalendarDays, CalendarRange, Timer,
} from 'lucide-react';

const MAX_CHARS = 1000;
const MAX_TAGS = 3;
const MAX_TAG_LEN = 20;
const MAX_REQUIREMENTS = 6;

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
  const [requirements, setRequirements] = useState([]);
  const [reqInput, setReqInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Schedule state
  const [scheduleType, setScheduleType] = useState('single'); // single | range | ongoing
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const isInner = profile?.role === 'Inner';
  const isVerifiedInner = isInner && profile?.isVerified;
  const charsLeft = MAX_CHARS - content.length;
  const today = new Date().toISOString().split('T')[0];

  function addTag() {
    let tag = tagInput.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-]/g, '');
    if (tag.length > MAX_TAG_LEN) tag = tag.slice(0, MAX_TAG_LEN);
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS) { setTags([...tags, tag]); setTagInput(''); }
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && !tagInput && tags.length) setTags(tags.slice(0, -1));
  }

  function addRequirement() {
    const req = reqInput.trim();
    if (req && requirements.length < MAX_REQUIREMENTS && !requirements.includes(req)) { setRequirements([...requirements, req]); setReqInput(''); }
  }

  function buildTimestamp(date, time) {
    if (!date) return null;
    const str = time ? `${date}T${time}` : `${date}T09:00`;
    return Timestamp.fromDate(new Date(str));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const trimmed = content.trim();
    if (!trimmed) return setError('Write something first.');
    if (isTask && scheduleType !== 'ongoing' && !startDate) return setError('Pick a date for the task.');
    if (scheduleType === 'range' && endDate && startDate > endDate) return setError('End date must be after start date.');

    try {
      setLoading(true);

      const schedule = {
        type: isTask ? scheduleType : null,
        startDate: buildTimestamp(startDate, startTime),
        endDate: scheduleType === 'range' ? buildTimestamp(endDate, endTime) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        ongoing: scheduleType === 'ongoing',
      };

      await addDoc(collection(db, 'posts'), {
        authorID: user.uid,
        authorName: profile?.name || 'Anonymous',
        authorRole: profile?.role || 'Looper',
        content: trimmed,
        tags,
        postTime: Timestamp.now(),
        isInnerOnly: innerPost,
        taskCapacity: isTask ? Number(taskCapacity) : null,
        taskFilled: isTask ? 0 : null,
        waitlist: isTask ? [] : null,
        joinedUsers: isTask ? [] : null,
        hoursReward: isTask ? Number(hoursReward) : null,
        schedule,
        requirements: isTask && requirements.length > 0 ? requirements : [],
        applicants: isTask ? [] : null,
        status: 'active',
        location: null,
      });
      toast.success('Posted!');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to post. Try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-loop-green/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-loop-gray/50 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-display text-lg font-bold">{innerPost ? 'Inner Loop Post' : 'New Post'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-loop-red/10 border border-loop-red/20 flex items-start gap-2">
              <AlertCircle size={16} className="text-loop-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-loop-red">{error}</p>
            </div>
          )}

          {/* Content */}
          <div>
            <textarea value={content} onChange={e => { if (e.target.value.length <= MAX_CHARS) setContent(e.target.value); }}
              placeholder="What's happening in your neighborhood?" rows={3}
              className="w-full px-4 py-3 rounded-xl border border-loop-gray bg-loop-gray/20 text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20 resize-none" />
            <p className={`text-xs text-right mt-1 ${charsLeft < 30 ? 'text-loop-red font-semibold' : 'text-loop-green/30'}`}>{charsLeft} left</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1"><Hash size={12} className="text-loop-green/40" /> Tags ({tags.length}/{MAX_TAGS})</label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-loop-gray bg-loop-gray/20 min-h-[36px]">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-loop-blue/20 text-xs font-medium">
                  #{tag} <button type="button" onClick={() => setTags(tags.filter(x => x !== tag))} className="hover:text-loop-red"><X size={10} /></button>
                </span>
              ))}
              {tags.length < MAX_TAGS && (
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value.slice(0, MAX_TAG_LEN))}
                  onKeyDown={handleTagKeyDown} onBlur={() => tagInput.trim() && addTag()}
                  placeholder="Type + Enter" maxLength={MAX_TAG_LEN}
                  className="flex-1 min-w-[70px] bg-transparent text-xs placeholder:text-loop-green/30 focus:outline-none" />
              )}
            </div>
          </div>

          {/* Task toggle */}
          <div className="p-3 rounded-xl bg-loop-gray/30 border border-loop-gray/50 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium flex items-center gap-2"><Users size={15} className="text-loop-purple" /> Task with capacity</span>
              <div onClick={() => setIsTask(!isTask)} className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${isTask ? 'bg-loop-purple' : 'bg-loop-green/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isTask ? 'translate-x-5' : ''}`} />
              </div>
            </label>

            {isTask && (
              <div className="space-y-3 pt-2 border-t border-loop-gray/50">
                {/* Schedule Type */}
                <div>
                  <label className="block text-[10px] font-semibold mb-1.5 text-loop-green/60 uppercase tracking-wide flex items-center gap-1">
                    <CalendarDays size={10} /> Schedule
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'single', label: 'Single day', icon: CalendarDays },
                      { id: 'range', label: 'Date range', icon: CalendarRange },
                      { id: 'ongoing', label: 'Ongoing', icon: Timer },
                    ].map(opt => (
                      <button key={opt.id} type="button" onClick={() => setScheduleType(opt.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[10px] font-medium transition-all
                          ${scheduleType === opt.id ? 'border-loop-purple bg-loop-purple/5 text-loop-purple' : 'border-loop-gray/50 text-loop-green/50 hover:border-loop-purple/30'}`}>
                        <opt.icon size={14} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date pickers */}
                {scheduleType !== 'ongoing' && (
                  <div className="space-y-2">
                    <div className={scheduleType === 'range' ? 'grid grid-cols-2 gap-2' : ''}>
                      <div>
                        <label className="block text-[10px] font-medium mb-0.5 text-loop-green/50">
                          {scheduleType === 'range' ? 'Start date' : 'Date'}
                        </label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={today}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                      </div>
                      {scheduleType === 'range' && (
                        <div>
                          <label className="block text-[10px] font-medium mb-0.5 text-loop-green/50">End date</label>
                          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || today}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                        </div>
                      )}
                    </div>

                    {/* Time pickers */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium mb-0.5 text-loop-green/50">Start time (optional)</label>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium mb-0.5 text-loop-green/50">End time (optional)</label>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                      </div>
                    </div>
                  </div>
                )}

                {scheduleType === 'ongoing' && (
                  <p className="text-xs text-loop-green/40 italic">This task has no fixed date — it's available on a rolling basis.</p>
                )}

                {/* Capacity + Hours */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium mb-0.5 text-loop-green/60">Spots</label>
                    <input type="number" min={1} max={50} value={taskCapacity} onChange={e => setTaskCapacity(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium mb-0.5 text-loop-green/60">Hours reward</label>
                    <input type="number" min={0.5} max={24} step={0.5} value={hoursReward} onChange={e => setHoursReward(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-loop-gray bg-white text-sm focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-[10px] font-medium mb-1 text-loop-green/60 flex items-center gap-1">
                    <ClipboardCheck size={10} /> Requirements (optional)
                  </label>
                  {requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-1.5 mb-1">
                      <span className="flex-1 px-2 py-1 rounded-lg bg-loop-purple/5 text-xs border border-loop-purple/10">{req}</span>
                      <button type="button" onClick={() => setRequirements(requirements.filter((_, j) => j !== i))} className="text-loop-green/30 hover:text-loop-red"><X size={12} /></button>
                    </div>
                  ))}
                  {requirements.length < MAX_REQUIREMENTS && (
                    <div className="flex gap-1.5">
                      <input type="text" value={reqInput} onChange={e => setReqInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                        placeholder="e.g. Must have car, 18+..."
                        className="flex-1 px-2 py-1.5 rounded-lg border border-loop-gray bg-white text-xs placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20" />
                      <button type="button" onClick={addRequirement} disabled={!reqInput.trim()}
                        className="px-2 py-1.5 rounded-lg bg-loop-purple/10 text-loop-purple text-xs font-semibold disabled:opacity-30"><Plus size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Inner Only */}
          {isVerifiedInner && (
            <label className="flex items-center justify-between p-3 rounded-xl bg-loop-purple/5 border border-loop-purple/10 cursor-pointer">
              <span className="text-sm font-medium flex items-center gap-2"><Lock size={15} className="text-loop-purple" /> Inner Loop only</span>
              <div onClick={() => setInnerPost(!innerPost)} className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${innerPost ? 'bg-loop-purple' : 'bg-loop-green/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${innerPost ? 'translate-x-5' : ''}`} />
              </div>
            </label>
          )}

          <button type="submit" disabled={loading || !content.trim()}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all
              ${innerPost ? 'bg-loop-purple' : 'bg-loop-green'}
              ${loading || !content.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Post</>}
          </button>
        </form>
      </div>
    </div>
  );
}
