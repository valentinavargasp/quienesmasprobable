import { Crown, Mic, Trophy } from 'lucide-react';
import { Avatar, Card, plural } from './ui';

export default function Results({ active, votes, winners, question }) {
  const sorted = [...active].sort((a, b) => (votes[b.name] || 0) - (votes[a.name] || 0));
  const max = Math.max(1, ...sorted.map((p) => votes[p.name] || 0));
  const tie = winners.length > 1;
  const winnerVotes = votes[winners[0]] || 0;
  const QuestionIcon = question.icon;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3 p-5 md:p-7 animate-fadeUp">
        <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 flex items-center gap-2 mb-5">
          <Trophy className="w-6 h-6 text-indigo-500" /> Resultados de la ronda
        </h3>
        <div className="space-y-3">
          {sorted.map((p, i) => {
            const n = votes[p.name] || 0;
            const win = winners.includes(p.name);
            return (
              <div key={p.name} className={`flex items-center gap-3 rounded-2xl p-2 ${win ? 'bg-yellow-50 ring-2 ring-yellow-300' : ''}`}>
                <Avatar name={p.name} size="w-10 h-10 text-base" />
                <div className="w-24 md:w-28 font-extrabold text-slate-900 truncate">{p.name}</div>
                <div className="flex-1 h-9 bg-slate-100 rounded-xl overflow-hidden">
                  {n > 0 && (
                    <div
                      className={`h-full rounded-xl bg-gradient-to-r ${p.bar} animate-grow flex items-center justify-end pr-3`}
                      style={{ width: `${(n / max) * 100}%`, animationDelay: `${i * 0.08}s` }}
                    >
                      <span className="text-white font-display font-bold text-lg">{n}</span>
                    </div>
                  )}
                </div>
                <div className="w-8 flex justify-center">
                  {win ? (
                    <Crown className="w-7 h-7 text-yellow-500 animate-wiggle" />
                  ) : n === 0 ? (
                    <span className="text-slate-300 font-bold">0</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 text-center animate-pop">
          <div className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
            {tie ? '¡Empate!' : 'La ronda se la lleva'}
          </div>
          <div className="flex justify-center gap-4 mt-8 mb-4 flex-wrap">
            {winners.map((w) => (
              <div key={w} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar name={w} size="w-20 h-20 text-4xl" />
                  <Crown className="w-9 h-9 text-yellow-400 fill-yellow-300 absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow animate-wiggle" />
                </div>
                <span className="font-display font-bold text-2xl text-slate-900">{w}</span>
              </div>
            ))}
          </div>
          <div className="text-slate-500 font-bold">
            {plural(winnerVotes, 'voto')}
            {tie ? ' cada uno' : ''}
          </div>
        </Card>

        <div
          className="rounded-3xl p-6 md:p-7 bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-400 shadow-xl shadow-orange-900/20 animate-fadeUp"
          style={{ animationDelay: '.25s' }}
        >
          <span className="inline-flex bg-indigo-950 text-yellow-300 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider items-center gap-1.5 mb-3">
            <QuestionIcon className="w-4 h-4" /> {question.tipo}
          </span>
          <p className="font-display font-semibold text-2xl md:text-[1.7rem] leading-snug text-indigo-950">
            {question.consigna}
          </p>
          <div className="mt-4 pt-4 border-t border-indigo-950/15 text-indigo-950/80 font-extrabold flex items-center gap-2">
            <Mic className="w-5 h-5" /> Le toca a: {winners.join(' y ')}
          </div>
        </div>
      </div>
    </div>
  );
}
