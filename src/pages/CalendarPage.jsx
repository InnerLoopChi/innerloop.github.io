import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar, ChevronLeft, ChevronRight, Users, Clock, Building2, Heart, Loader2, Zap, CalendarDays,
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), where('taskCapacity', '>', 0), orderBy('taskCapacity'), orderBy('postTime', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  function getTasksForDay(day) {
    return tasks.filter(t => {
      // Use eventDate if it exists, else fall back to postTime
      const date = t.eventDate?.toDate ? t.eventDate.toDate() : t.postTime?.toDate ? t.postTime.toDate() : null;
      if (!date) return false;
      return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
    });
  }

  const selectedTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  // Upcoming tasks (next 14 days)
  const upcoming = tasks.filter(t => {
    const date = t.eventDate?.toDate ? t.eventDate.toDate() : null;
    if (!date) return false;
    const diff = date.getTime() - Date.now();
    return diff > 0 && diff < 14 * 86400000;
  }).sort((a, b) => {
    const da = a.eventDate.toDate();
    const db_ = b.eventDate.toDate();
    return da - db_;
  });

  return (
    <div className="min-h-screen bg-loop-gray">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="font-display text-lg font-extrabold flex items-center gap-2"><Calendar size={18} className="text-loop-purple" /> Task Calendar</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-loop-gray/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { setCurrentMonth(new Date(year, month - 1, 1)); setSelectedDate(null); }}
              className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center"><ChevronLeft size={16} /></button>
            <h2 className="font-display font-bold">{MONTHS[month]} {year}</h2>
            <button onClick={() => { setCurrentMonth(new Date(year, month + 1, 1)); setSelectedDate(null); }}
              className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center"><ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-loop-green/40 py-0.5">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayTasks = getTasksForDay(day);
              const hasTasks = dayTasks.length > 0;
              const isSelected = selectedDate === day;

              return (
                <button key={day} onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all
                    ${isSelected ? 'bg-loop-purple text-white scale-105 shadow-md' :
                      isToday ? 'bg-loop-purple/10 text-loop-purple font-bold ring-1 ring-loop-purple/30' :
                      hasTasks ? 'bg-loop-green/5 hover:bg-loop-green/10' : 'hover:bg-loop-gray/40'}`}>
                  {day}
                  {hasTasks && !isSelected && (
                    <div className="absolute bottom-0.5 flex gap-0.5">
                      {dayTasks.slice(0, 3).map((_, j) => <div key={j} className="w-1 h-1 rounded-full bg-loop-purple" />)}
                    </div>
                  )}
                  {hasTasks && isSelected && <span className="text-[8px] font-bold">{dayTasks.length}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day tasks */}
        {selectedDate && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-loop-green/60">{MONTHS[month]} {selectedDate} — {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}</h3>
            {selectedTasks.length === 0 ? (
              <p className="bg-white rounded-2xl border p-6 text-center text-sm text-loop-green/40">No tasks on this day</p>
            ) : selectedTasks.map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        )}

        {/* Upcoming */}
        {!selectedDate && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-loop-green/60">Upcoming (next 2 weeks)</h3>
            {loading ? <div className="flex justify-center py-6"><Loader2 size={24} className="animate-spin text-loop-purple" /></div> :
              upcoming.length === 0 ? (
                <p className="bg-white rounded-2xl border p-6 text-center text-sm text-loop-green/40">No upcoming tasks</p>
              ) : upcoming.map(t => <TaskRow key={t.id} task={t} showDate />)}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, showDate = false }) {
  const date = task.eventDate?.toDate ? task.eventDate.toDate() : null;
  const isFull = (task.taskFilled || 0) >= task.taskCapacity;

  return (
    <div className="bg-white rounded-xl border border-loop-gray/50 p-3 flex items-start gap-3">
      {/* Date badge */}
      {showDate && date && (
        <div className="w-11 h-11 rounded-lg bg-loop-purple/10 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-[9px] font-bold text-loop-purple uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-sm font-bold text-loop-purple leading-none">{date.getDate()}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {task.authorRole === 'Inner'
            ? <Building2 size={11} className="text-loop-purple flex-shrink-0" />
            : <Heart size={11} className="text-loop-red flex-shrink-0" />}
          <span className="text-xs font-semibold truncate">{task.authorName}</span>
        </div>
        <p className="text-xs text-loop-green/70 line-clamp-2">{task.content}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-loop-green/40">
          {date && <span className="flex items-center gap-0.5"><CalendarDays size={9} /> {date.toLocaleDateString('en-US', { weekday: 'short' })} {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>}
          <span className="flex items-center gap-0.5"><Users size={9} /> {task.taskFilled || 0}/{task.taskCapacity}</span>
          <span className="flex items-center gap-0.5"><Clock size={9} /> +{task.hoursReward}h</span>
          {isFull && <span className="text-loop-red font-semibold">Full</span>}
        </div>
      </div>
    </div>
  );
}
