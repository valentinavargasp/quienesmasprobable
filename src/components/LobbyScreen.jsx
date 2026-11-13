import { BookOpen, Check, Hourglass, MousePointerClick, Timer, Users, Zap } from 'lucide-react';
import { PEOPLE } from '../data/people';
import { TOTAL_ROUNDS } from '../data/questions';
import { Card } from './ui';
import HostMissing from './HostMissing';

const RULES = [
  { icon: Users, color: 'bg-indigo-100 text-indigo-600', t: 'Cada uno entra con su nombre', d: 'Desde su celular o compu, con el link de la sala.' },
  { icon: Timer, color: 'bg-pink-100 text-pink-600', t: 'Cuenta regresiva', d: 'La moderación lanza el 3, 2, 1, ¡YA! en todas las pantallas.' },
  { icon: MousePointerClick, color: 'bg-amber-100 text-amber-600', t: 'Votás una sola vez', d: 'Elegís a alguien y confirmás. No se puede cambiar.' },
  { icon: Zap, color: 'bg-emerald-100 text-emerald-600', t: 'El más votado cumple', d: 'Reto, confesión o derecho a réplica.' },
];

export function PlayersGrid({ presence, myName, className = '' }) {
  const online = PEOPLE.filter((p) => presence[p.name]).length;

  return (
    <Card className={`p-6 md:p-8 animate-fadeUp ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-indigo-500" /> En la llamada
        </h2>
        <span className="text-sm font-extrabold bg-emerald-100 text-emerald-700 rounded-full px-3 py-1">
          {online} de {PEOPLE.length} confirmados
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PEOPLE.map((p) => {
          const on = Boolean(presence[p.name]);
          const me = p.name === myName;
          return (
            <div
              key={p.name}
              className={`relative rounded-2xl p-4 border-2 flex items-center gap-3 transition-all ${
                on ? `${p.soft} ${p.border} shadow-md` : 'bg-slate-50 border-dashed border-slate-300'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg ${
                  on ? p.solid : 'bg-slate-300'
                }`}
              >
                {p.name[0]}
              </div>
              <div className="min-w-0">
                <div className={`font-extrabold truncate ${on ? 'text-slate-900' : 'text-slate-400'}`}>
                  {p.name} {me && <span className="text-xs text-slate-500">(vos)</span>}
                </div>
                <div className={`text-xs font-bold flex items-center gap-1 ${on ? p.text : 'text-slate-400'}`}>
                  {on ? (
                    'Confirmado/a'
                  ) : (
                    <>
                      <Hourglass className="w-3.5 h-3.5" /> Esperando…
                    </>
                  )}
                </div>
              </div>
              {on && (
                <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${p.solid} text-white flex items-center justify-center shadow animate-pop`}>
                  <Check className="w-4 h-4" strokeWidth={3} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-slate-500 text-sm font-semibold mt-4">
        Solo quienes confirmen su nombre antes de empezar aparecen en la votación (si alguien entra tarde, se suma solo).
      </p>
    </Card>
  );
}

export function RulesCard({ className = '' }) {
  return (
    <Card className={`p-6 md:p-8 animate-fadeUp ${className}`}>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-900 flex items-center gap-2 mb-5">
        <BookOpen className="w-7 h-7 text-pink-500" /> Reglas
      </h2>
      <ol className="space-y-4">
        {RULES.map((r, i) => {
          const RuleIcon = r.icon;
          return (
            <li key={r.t} className="flex gap-3">
              <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center shrink-0`}>
                <RuleIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900">
                  {i + 1}. {r.t}
                </div>
                <div className="text-slate-500 font-semibold text-sm">{r.d}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export default function LobbyScreen({ g }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
      <header className="text-center text-white animate-fadeUp">
        <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.05]">¿Quién es más probable que…?</h1>
        <p className="mt-3 text-lg md:text-xl text-white/85 font-semibold">Sala de espera · {TOTAL_ROUNDS} rondas</p>
      </header>

      <div className="grid md:grid-cols-5 gap-6 mt-8">
        <PlayersGrid presence={g.presence} myName={g.myName} className="md:col-span-3" />
        <RulesCard className="md:col-span-2" />
      </div>

      <div className="mt-8 flex justify-center">
        {g.hostOnline ? (
          <div className="flex items-center gap-3 bg-white/15 border border-white/25 text-white rounded-full px-6 py-3 font-bold text-lg">
            <Hourglass className="w-5 h-5 animate-pulse" /> Esperando que la moderación comience…
          </div>
        ) : (
          <HostMissing />
        )}
      </div>
    </div>
  );
}
