import { useState } from 'react';
import { Fingerprint, Loader2, PartyPopper, Wifi } from 'lucide-react';
import { PEOPLE } from '../data/people';
import { Card } from './ui';

export default function IdentifyScreen({ presence, gameStatus, onClaim }) {
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

  const pick = async (name) => {
    setError(null);
    setPending(name);
    const ok = await onClaim(name);
    if (!ok) setError(`${name} ya ingresó desde otro dispositivo. Si sos vos, cerrá esa pestaña y volvé a intentar.`);
    setPending(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <header className="text-center text-white animate-fadeUp">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm font-extrabold tracking-wide uppercase">
          <PartyPopper className="w-4 h-4" /> Rompehielos de la Weekly
        </div>
        <h1 className="font-display font-bold text-5xl md:text-7xl mt-5 leading-[1.05]">¿Quién es más probable que…?</h1>
      </header>

      <Card className="mt-10 p-6 md:p-10 animate-fadeUp">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 flex items-center gap-3">
          <Fingerprint className="w-9 h-9 text-indigo-500" /> ¿Quién sos?
        </h2>
        <p className="text-slate-500 font-semibold mt-2 mb-6">
          Tocá tu nombre para confirmar que estás en la llamada. Desde este dispositivo vas a votar una vez por ronda.
          {gameStatus === 'playing' && ' La partida ya empezó: entrás directo a la ronda actual.'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {PEOPLE.map((p) => {
            const taken = Boolean(presence[p.name]);
            const isPending = pending === p.name;
            return (
              <button
                key={p.name}
                onClick={() => pick(p.name)}
                disabled={taken || Boolean(pending)}
                className={`btn-press group rounded-2xl p-4 md:p-5 border-2 flex flex-col items-center gap-3 ${
                  taken
                    ? 'bg-slate-50 border-slate-200 cursor-not-allowed'
                    : `bg-white ${p.border} hover:-translate-y-0.5 hover:shadow-lg`
                }`}
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-white font-display font-bold text-3xl md:text-4xl shadow-md ${
                    taken ? 'bg-slate-300' : p.solid
                  }`}
                >
                  {isPending ? <Loader2 className="w-8 h-8 animate-spin" /> : p.name[0]}
                </div>
                <div className={`font-display font-bold text-xl ${taken ? 'text-slate-400' : 'text-slate-900'}`}>{p.name}</div>
                {taken ? (
                  <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" /> Ya ingresó
                  </span>
                ) : (
                  <span className={`text-xs font-extrabold ${p.text}`}>Soy yo</span>
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="mt-5 text-rose-600 font-bold text-center">{error}</p>}
      </Card>
    </div>
  );
}
