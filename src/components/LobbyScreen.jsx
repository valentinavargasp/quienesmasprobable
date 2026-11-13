import { useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Hourglass,
  Link2,
  MousePointerClick,
  Play,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Zap,
} from 'lucide-react';
import { DEFAULT_HOST, PEOPLE } from '../data/people';
import { Card } from './ui';

const RULES = [
  { icon: Users, color: 'bg-indigo-100 text-indigo-600', t: 'Cada uno entra con su nombre', d: 'Desde su compu o celular, con el link de la sala.' },
  { icon: Timer, color: 'bg-pink-100 text-pink-600', t: 'Cuenta regresiva', d: 'Quien modera lanza el 3, 2, 1, ¡YA! en todas las pantallas.' },
  { icon: MousePointerClick, color: 'bg-amber-100 text-amber-600', t: 'Votás una sola vez', d: 'Elegís a alguien y confirmás. No se puede cambiar.' },
  { icon: Zap, color: 'bg-emerald-100 text-emerald-600', t: 'El más votado cumple', d: 'Reto, confesión o derecho a réplica.' },
];

export default function LobbyScreen({ g }) {
  const [copied, setCopied] = useState(false);
  const { presence, myName, isHost, hostOnline, game } = g;
  const online = g.onlineNames.length;
  const canStart = online >= 2;
  const link = window.location.href;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
      <header className="text-center text-white animate-fadeUp">
        <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.05]">¿Quién es más probable que…?</h1>
        <p className="mt-3 text-lg md:text-xl text-white/85 font-semibold">Sala de espera · 10 rondas</p>
      </header>

      <div className="grid md:grid-cols-5 gap-6 mt-8">
        <Card className="md:col-span-3 p-6 md:p-8 animate-fadeUp">
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
              const host = game?.host === p.name;
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
                      {host && on ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" /> Modera
                        </>
                      ) : on ? (
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

          <div className="mt-5 flex items-center gap-2 bg-indigo-50 rounded-2xl p-2 pl-4">
            <Link2 className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="text-sm font-bold text-indigo-900 truncate flex-1">{link}</span>
            <button onClick={copy} className="btn-press flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl px-3 py-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiado' : 'Copiar link'}
            </button>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6 md:p-8 animate-fadeUp">
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
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {isHost ? (
          <>
            <button
              onClick={g.startGame}
              disabled={!canStart}
              className="btn-press group inline-flex items-center gap-3 bg-yellow-300 hover:bg-yellow-200 disabled:bg-white/40 disabled:cursor-not-allowed text-indigo-950 font-display font-bold text-2xl md:text-3xl px-10 md:px-14 py-5 rounded-full shadow-[0_8px_0_0_rgba(30,27,75,.35)]"
            >
              <Play className="w-8 h-8 fill-current" /> Comenzar Juego
              <ChevronRight className="w-7 h-7 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-white/90 font-bold">
              {canStart ? `Empiezan ${online} participantes.` : 'Hacen falta al menos 2 personas confirmadas.'}
            </p>
          </>
        ) : hostOnline ? (
          <div className="flex items-center gap-3 bg-white/15 border border-white/25 text-white rounded-full px-6 py-3 font-bold text-lg">
            <Hourglass className="w-5 h-5 animate-pulse" /> Esperando que {game.host} comience el juego…
          </div>
        ) : (
          <>
            {!presence[DEFAULT_HOST] && (
              <div className="flex items-center gap-3 bg-white/15 border border-white/25 text-white rounded-full px-6 py-3 font-bold text-lg">
                <Hourglass className="w-5 h-5 animate-pulse" /> Esperando a {DEFAULT_HOST} para moderar
              </div>
            )}
            <button
              onClick={g.becomeHost}
              className="btn-press inline-flex items-center gap-3 bg-white hover:bg-indigo-50 text-indigo-700 font-display font-bold text-xl md:text-2xl px-9 py-4 rounded-full shadow-[0_6px_0_0_rgba(30,27,75,.35)]"
            >
              <Sparkles className="w-6 h-6" /> Quiero moderar
            </button>
            <p className="text-white/90 font-bold text-center">
              Quien modera lanza la cuenta regresiva, revela resultados y pasa de ronda. También vota como el resto.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
