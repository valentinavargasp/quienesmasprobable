import { useMemo } from 'react';
import { personOf } from '../data/people';

export function Avatar({ name, size = 'w-12 h-12 text-xl' }) {
  const p = personOf(name);
  return (
    <div
      className={`${size} ${p.solid} rounded-2xl flex items-center justify-center text-white font-display font-bold shadow-md shrink-0`}
    >
      {name[0]}
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
