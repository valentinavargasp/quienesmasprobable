import { Check, CheckCircle2, Vote } from 'lucide-react';
import { personOf } from '../data/people';
import { CATEGORIES, QUESTIONS, TOTAL_ROUNDS } from '../data/questions';
import { Card } from './ui';

export function RoundHeader({ round }) {
  const question = QUESTIONS[round];
  const cat = CATEGORIES[question.cat];
  const CatIcon = cat.icon;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="bg-white text-indigo-700 font-display font-bold text-lg md:text-xl rounded-full px-5 py-2 shadow">
          Ronda {round + 1} de {TOTAL_ROUNDS}
        </span>
        <span className={`${cat.chip} font-extrabold rounded-full px-4 py-2 flex items-center gap-2`}>
          <CatIcon className="w-4 h-4" /> {question.cat}
        </span>
      </div>
      <div className="flex gap-1.5 mb-6">
        {QUESTIONS.map((q, i) => (
          <div
            key={q.award}
            className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
              i < round ? 'bg-yellow-300' : i === round ? 'bg-white' : 'bg-white/25'
            }`}
          />
        ))}
      </div>
    </>
  );
}

export function QuestionCard({ round, big = false }) {
  const question = QUESTIONS[round];

  return (
    <Card key={round} className={`${big ? 'p-8 md:p-14' : 'p-7 md:p-12'} text-center animate-fadeUp`}>
      <div className={`text-indigo-500 font-display font-semibold mb-3 ${big ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
        ¿Quién es más probable que…
      </div>
      <h2
        className={`font-display font-bold leading-tight text-slate-900 mx-auto ${
          big ? 'text-4xl md:text-6xl max-w-5xl' : 'text-3xl md:text-5xl max-w-4xl'
        }`}
      >
        {question.q}?
      </h2>
    </Card>
  );
}

export function VoteProgress({ voters, roundVotes }) {
  const votedNames = Object.keys(roundVotes);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="font-extrabold text-slate-700 flex items-center gap-2">
          <Vote className="w-5 h-5 text-indigo-500" /> Votaron {votedNames.length} de {voters.length}
        </span>
        {votedNames.length >= voters.length && voters.length > 0 && (
          <span className="text-emerald-600 font-extrabold text-sm flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> ¡Están todos!
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {voters.map((n) => {
          const done = votedNames.includes(n);
          const p = personOf(n);
          return (
            <span
              key={n}
              className={`inline-flex items-center gap-1.5 rounded-full pl-1 pr-3 py-1 font-bold text-sm transition-all ${
                done ? `${p.soft} ${p.text}` : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${done ? p.solid : 'bg-slate-300'}`}>
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : n[0]}
              </span>
              {n}
            </span>
          );
        })}
      </div>
    </>
  );
}
