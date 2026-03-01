import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, AlertCircle, Info, X, Zap } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS = {
  success: <Check size={16} className="text-green-600" />,
  error: <AlertCircle size={16} className="text-loop-red" />,
  info: <Info size={16} className="text-loop-purple" />,
  reward: <Zap size={16} className="text-yellow-500" />,
};

const STYLES = {
  success: 'border-green-200 bg-green-50',
  error: 'border-loop-red/20 bg-loop-red/5',
  info: 'border-loop-purple/20 bg-loop-purple/5',
  reward: 'border-yellow-200 bg-yellow-50',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Convenience methods
  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    reward: (msg) => addToast(msg, 'reward', 6000),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
              animate-fadeIn ${STYLES[t.type] || STYLES.info}`}
          >
            <div className="flex-shrink-0 mt-0.5">{ICONS[t.type] || ICONS.info}</div>
            <p className="flex-1 text-sm font-medium text-loop-green/80">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 text-loop-green/30 hover:text-loop-green/60 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
