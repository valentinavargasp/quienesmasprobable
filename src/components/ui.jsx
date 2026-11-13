import { useEffect, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { personOf } from '../data/people';

export function Avatar({ name, size = 'w-12 h-12 text-xl' }) {
  const solid = personOf(name)?.solid || 'bg-slate-400';
  return (
    <div
      className={`${size} ${solid} rounded-2xl flex items-center justify-center text-white font-display font-bold shadow-md shrink-0`}
    >
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

export function Card({ className = '', children }) {
  return (
    <div className={`bg-white/95 backdrop-blur rounded-3xl shadow-xl shadow-indigo-900/20 ${className}`}>
      {children}
    </div>
  );
}

const CONFETTI_COLORS = ['#f472b6', '#facc15', '#38bdf8', '#a78bfa', '#34d399', '#fb923c'];

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 2.2 + Math.random() * 1.8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    []
  );

  return pieces.map((c, i) => (
    <span
      key={i}
      className="confetti"
      style={{
        left: `${c.left}vw`,
        background: c.color,
        animationDuration: `${c.dur}s`,
        animationDelay: `${c.delay}s`,
      }}
    />
  ));
}

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onCancel}
      role="presentation"
    >
      <Card className="max-w-md w-full p-7 text-center animate-pop">
        <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 id="confirm-title" className="font-display font-bold text-2xl text-slate-900 mt-4">
            {title}
          </h2>
          {message && <p className="text-slate-500 font-semibold mt-2">{message}</p>}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center mt-7">
            <button
              onClick={onCancel}
              autoFocus
              className="btn-press bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full px-6 py-3"
            >
              Cancelar
            </button>
            <button onClick={onConfirm} className="btn-press bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-full px-6 py-3">
              {confirmLabel}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
