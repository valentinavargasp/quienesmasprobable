import { useMemo } from 'react';
import { Award, Crown, EyeOff, Hourglass, Medal, RotateCcw, Trophy } from 'lucide-react';
import { personOf } from '../data/people';
import { CATEGORIES, QUESTIONS } from '../data/questions';
import { Avatar, Card, Confetti, plural } from './ui';

const PODIUM_HEIGHT = ['h-40 md:h-48', 'h-28 md:h-36', 'h-20 md:h-28'];
const MEDAL = ['bg-yellow-300 text-yellow-900', 'bg-slate-200 text-slate-700', 'bg-orange-200 text-orange-800'];

export default function FinalScreen({ active, history, isHost, hostName, onRestart }) {
  const { totals, wins } = useMemo(() => {
    const t = Object.fromEntries(active.map((p) => [p.name, 0]));
    const w = Object.fromEntries(active.map((p) => [p.name, 0]));
    history.forEach((h) => {
      if (!h) return;
      Object.entries(h.votes).forEach(([n, v]) => {
        if (n in t) t[n] += v;
      });
      h.winners.forEach((n) => {
        if (n in w) w[n] += 1;
      });
    });
    return { totals: t, wins: w };
  }, [active, history]);

  const ranking = [...active].sort((a, b) => totals[b.name] - totals[a.name] || wins[b.name] - wins[a.name]);
  if (ranking.length === 0) return null;
  const topScore = totals[ranking[0].name];
  const mvps = ranking.filter((p) => totals[p.name] === topScore);
  const minScore = totals[ranking[ranking.length - 1].name];
  const ninjas = ranking.filter((p) => totals[p.name] === minScore);
  const showNinja = minScore < topScore;

  const podium = ranking.slice(0, 3);
  const podiumOrder = podium.length === 3 ? [podium[1], podium[0], podium[2]] : podium;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <Confetti />

      <header className="text-center text-white animate-fadeUp">
        <Trophy className="w-16 h-16 mx-auto text-yellow-300 animate-wiggle" />
        <h1 className="font-display font-bold text-5xl md:text-6xl mt-3">Premios de la Weekly</h1>
        <p className="text-white/85 text-lg md:text-xl font-semibold mt-2">
          Los resultados que nadie pidió, pero todos merecen
        </p>
      </header>

      <div className="grid lg:grid-cols-5 gap-6 mt-10">
        <Card className="lg:col-span-2 p-7 text-center flex flex-col justify-center animate-pop">
          <div className="text-sm font-extrabold uppercase tracking-widest text-pink-500">Gran premio</div>
          <div className="font-display font-bold text-3xl text-slate-900 mt-1">MVP de la Weekly</div>
          <div className="flex justify-center gap-4 mt-10 mb-5 flex-wrap">
            {mvps.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar name={p.name} size="w-24 h-24 text-5xl" />
                  <Crown className="w-10 h-10 text-yellow-400 fill-yellow-300 absolute -top-7 left-1/2 -translate-x-1/2 animate-wiggle" />
                </div>
                <span className="font-display font-bold text-2xl">{p.name}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 font-bold">
            {plural(topScore, 'voto')} acumulados · la persona más “probable” del equipo
          </p>

          {showNinja && (
            <div className="mt-5 pt-5 border-t border-slate-100 text-left flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900">Ninja del Perfil Bajo</div>
                <div className="text-slate-500 font-semibold text-sm">
                  {ninjas.map((n) => n.name).join(', ')} · {plural(minScore, 'voto')}. Nadie sospecha nada…
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-3 p-6 md:p-8 animate-fadeUp">
          <h3 className="font-display font-bold text-2xl text-slate-900 flex items-center gap-2">
            <Medal className="w-6 h-6 text-amber-500" /> Podio de votos totales
          </h3>
          <div className="flex items-end justify-center gap-3 md:gap-5 mt-8">
            {podiumOrder.map((p) => {
              const pos = ranking.indexOf(p);
              return (
                <div key={p.name} className="flex flex-col items-center w-24 md:w-32">
                  <Avatar name={p.name} size="w-14 h-14 text-2xl" />
                  <div className="font-extrabold text-slate-900 mt-2 truncate max-w-full">{p.name}</div>
                  <div className="text-sm font-bold text-slate-500 mb-2">{plural(totals[p.name], 'voto')}</div>
                  <div
                    className={`w-full ${PODIUM_HEIGHT[pos]} ${p.solid} rounded-t-2xl flex items-start justify-center pt-3 shadow-inner animate-fadeUp`}
                    style={{ animationDelay: `${pos * 0.15}s` }}
                  >
                    <span className={`w-10 h-10 rounded-full ${MEDAL[pos]} font-display font-bold text-xl flex items-center justify-center shadow`}>
                      {pos + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {ranking.length > 3 && (
            <div className="mt-6 grid sm:grid-cols-3 gap-2">
              {ranking.slice(3).map((p, i) => (
                <div key={p.name} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                  <span className="font-display font-bold text-slate-400 w-5">{i + 4}</span>
                  <Avatar name={p.name} size="w-8 h-8 text-sm" />
                  <span className="font-bold text-slate-800 truncate flex-1">{p.name}</span>
                  <span className="font-bold text-slate-500 text-sm">{totals[p.name]}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <h3 className="font-display font-bold text-3xl text-white mt-12 mb-5 flex items-center gap-2">
        <Award className="w-8 h-8 text-yellow-300" /> Títulos honoríficos
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUESTIONS.map((q, i) => {
          const h = history[i];
          if (!h) return null;
          const cat = CATEGORIES[q.cat];
          const QIcon = q.icon;
          return (
            <Card key={q.award} className="p-5 animate-fadeUp">
              <div className="flex items-start justify-between gap-2">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <QIcon className="w-6 h-6" />
                </div>
                <span className={`${cat.chip} text-xs font-extrabold rounded-full px-2.5 py-1`}>{q.cat}</span>
              </div>
              <div className="font-display font-bold text-xl text-slate-900 mt-3 leading-tight">{q.award}</div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {h.winners.map((w) => {
                  const p = personOf(w);
                  return (
                    <span key={w} className={`inline-flex items-center gap-1.5 ${p.soft} ${p.text} font-extrabold rounded-full pl-1 pr-3 py-1`}>
                      <span className={`w-6 h-6 rounded-full ${p.solid} text-white text-xs flex items-center justify-center`}>{w[0]}</span>
                      {w}
                    </span>
                  );
                })}
              </div>
              <div className="text-xs text-slate-400 font-bold mt-2">
                Ronda {i + 1} · {plural(h.votes[h.winners[0]], 'voto')}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center mt-12">
        {isHost ? (
          <button
            onClick={onRestart}
            className="btn-press inline-flex items-center gap-3 bg-yellow-300 hover:bg-yellow-200 text-indigo-950 font-display font-bold text-2xl px-10 py-5 rounded-full shadow-[0_8px_0_0_rgba(30,27,75,.35)]"
          >
            <RotateCcw className="w-7 h-7" /> Jugar de nuevo
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-white/15 border border-white/25 text-white rounded-full px-6 py-3 font-bold">
            <Hourglass className="w-5 h-5 animate-pulse" /> {hostName || 'La moderación'} puede reiniciar la partida
          </div>
        )}
      </div>
    </div>
  );
}
