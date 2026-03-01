import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar, ChevronLeft, ChevronRight, Users, Clock, Building2, Heart, Loader2, Timer, CalendarDays,
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'posts'), snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(t => t.taskCapacity > 0));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Get event date from task (uses schedule.startDate or falls back to postTime)
  function getTaskDate(task) {
    if (task.schedule?.startDate?.toDate) return task.schedule.startDate.toDate();
    if (task.postTime?.toDate) return task.postTime.toDate();
    return null;
  }

  function getTaskEndDate(task) {
    if (task.schedule?.endDate?.toDate) return task.schedule.endDate.toDate();
    return null;
  }

  // Check if a task falls on a specific day
  function taskOnDay(task, day) {
    const start = getTaskDate(task);
    if (!start) return false;
    const end = getTaskEndDate(task);

    const dayDate = new Date(year, month, day);
    dayDate.setHours(0, 0, 0, 0);

    const startDay = new Date(start);
    startDay.setHours(0, 0, 0, 0);

    if (end) {
      const endDay = new Date(end);
      endDay.setHours(0, 0, 0, 0);
      return dayDate >= startDay && dayDate <= endDay;
    }

    return dayDate.getTime() === startDay.getTime();
  }

  // Ongoing tasks (no fixed date)
  const ongoingTasks = tasks.filter(t => t.schedule?.ongoing);

  function getTasksForDay(day) {
    return tasks.filter(t => !t.schedule?.ongoing && taskOnDay(t, day));
  }

  const selectedTasks = selectedDate ? getTasksForDay(selectedDate) : [];

  function fmtClock(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="font-display text-lg font-extrabold flex items-center gap-2">
            <Calendar size={18} className="text-loop-purple" /> Task Calendar
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Month nav */}
        <div className="bg-white rounded-2xl border border-loop-gray/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => { setCurrentMonth(new Date(year, month - 1, 1)); setSelectedDate(null); }}
              className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center hover:bg-loop-gray/80"><ChevronLeft size={16} /></button>
            <h2 className="font-display text-base font-bold">{MONTHS[month]} {year}</h2>
            <button onClick={() => { setCurrentMonth(new Date(year, month + 1, 1)); setSelectedDate(null); }}
              className="w-8 h-8 rounded-full bg-loop-gray flex items-center justify-center hover:bg-loop-gray/80"><ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-[9px] font-semibold text-loop-green/40 py-0.5">{d}</div>)}
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
                      hasTasks ? 'bg-loop-green/5 hover:bg-loop-green/10' : 'hover:bg-loop-gray/50'}`}>
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

        {/* Selected date tasks */}
        {selectedDate && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-loop-green/60">{MONTHS[month]} {selectedDate} — {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}</h3>
            {selectedTasks.length === 0 ? (
              <p className="bg-white rounded-2xl border border-loop-gray/50 p-6 text-center text-sm text-loop-green/40">No tasks this day</p>
            ) : selectedTasks.map(t => <TaskRow key={t.id} task={t} fmtClock={fmtClock} />)}
          </div>
        )}

        {/* Ongoing tasks */}
        {ongoingTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-loop-green/60 flex items-center gap-1"><Timer size={11} /> Ongoing Tasks</h3>
            {ongoingTasks.map(t => <TaskRow key={t.id} task={t} fmtClock={fmtClock} ongoing />)}
          </div>
        )}

        {/* Upcoming (next tasks regardless of month) */}
        {!selectedDate && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-loop-green/60">Upcoming</h3>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 size={22} className="animate-spin text-loop-purple" /></div>
            ) : (
              tasks
                .filter(t => !t.schedule?.ongoing && getTaskDate(t) && getTaskDate(t) >= new Date())
                .sort((a, b) => (getTaskDate(a) || 0) - (getTaskDate(b) || 0))
                .slice(0, 8)
                .map(t => <TaskRow key={t.id} task={t} fmtClock={fmtClock} showDate />)
            )}
            {!loading && tasks.filter(t => !t.schedule?.ongoing && getTaskDate(t) && getTaskDate(t) >= new Date()).length === 0 && (
              <p className="bg-white rounded-2xl border border-loop-gray/50 p-6 text-center text-sm text-loop-green/40">No upcoming tasks</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, fmtClock, ongoing, showDate }) {
  const date = task.schedule?.startDate?.toDate ? task.schedule.startDate.toDate() : null;
  const endDate = task.schedule?.endDate?.toDate ? task.schedule.endDate.toDate() : null;

  return (
    <div className="bg-white rounded-xl border border-loop-gray/50 p-3 flex items-center gap-3">
      {/* Date badge */}
      <div className="w-11 h-11 rounded-lg bg-loop-purple/10 flex flex-col items-center justify-center flex-shrink-0">
        {ongoing ? (
          <Timer size={16} className="text-loop-purple" />
        ) : date ? (
          <>
            <span className="text-[9px] font-bold text-loop-purple">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span className="text-sm font-bold text-loop-purple leading-none">{date.getDate()}</span>
          </>
        ) : (
          <CalendarDays size={16} className="text-loop-purple/40" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{task.content?.slice(0, 55)}...</p>
        <div className="flex items-center gap-2 text-[10px] text-loop-green/40 mt-0.5 flex-wrap">
          <span>{task.authorName}</span>
          <span className="flex items-center gap-0.5"><Users size={8} /> {task.taskFilled || 0}/{task.taskCapacity}</span>
          <span className="flex items-center gap-0.5"><Clock size={8} /> +{task.hoursReward}h</span>
          {task.schedule?.startTime && <span>{fmtClock(task.schedule.startTime)}{task.schedule?.endTime ? ` – ${fmtClock(task.schedule.endTime)}` : ''}</span>}
          {showDate && date && <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{endDate ? ` → ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</span>}
          {ongoing && <span className="text-loop-purple font-semibold">Ongoing</span>}
        </div>
      </div>
    </div>
  );
}
