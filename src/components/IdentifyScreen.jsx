import { useState } from 'react';
import { Fingerprint, KeyRound, Loader2, MonitorPlay, PartyPopper, ShieldCheck, Wifi } from 'lucide-react';
import { PEOPLE } from '../data/people';
import { MODERATOR_PIN } from '../lib/firebase';
import { HOST_KEY } from '../hooks/useGame';
import { Card } from './ui';

export default function IdentifyScreen({ presence, gameStatus, onClaim }) {
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(null);
  const hostTaken = Boolean(presence[HOST_KEY]);

  const pick = async (name) => {
    setError(null);
    setPending(name);
    const ok = await onClaim(name);
    if (!ok) setError(`${name} ya ingresó desde otro dispositivo. Si sos vos, cerrá esa pestaña y volvé a intentar.`);
    setPending(null);
  };

  const moderate = async (e) => {
    e.preventDefault();
    setPinError(null);
    if (MODERATOR_PIN && pin.trim() !== MODERATOR_PIN) {
      setPinError('PIN incorrecto.');
      return;
    }
    setPending(HOST_KEY);
    const ok = await onClaim(HOST_KEY);
    if (!ok) setPinError('Ya hay alguien moderando desde otro dispositivo.');
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

      <form
        onSubmit={moderate}
        className="mt-6 rounded-3xl p-6 md:p-8 bg-indigo-950/85 border border-white/20 text-white shadow-xl shadow-indigo-900/30 animate-fadeUp"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-yellow-300 text-indigo-950 flex items-center justify-center shrink-0">
            <MonitorPlay className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl md:text-3xl">Modo moderación</h2>
            <p className="text-white/80 font-semibold mt-1">
              Pantalla para compartir en la llamada. No vota. Si también jugás, entrá con tu nombre desde el celular.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          {MODERATOR_PIN && !hostTaken && (
            <label className="flex items-center gap-2 bg-white/10 border border-white/25 rounded-full pl-4 pr-2 py-1.5 focus-within:ring-2 focus-within:ring-yellow-300">
              <KeyRound className="w-5 h-5 text-yellow-300 shrink-0" />
              <span className="sr-only">PIN de moderación</span>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN"
                className="bg-transparent outline-none font-bold text-lg w-28 placeholder:text-white/50"
              />
            </label>
          )}
          <button
            type="submit"
            disabled={hostTaken || Boolean(pending)}
            className="btn-press inline-flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-200 disabled:bg-white/20 disabled:text-white/60 disabled:cursor-not-allowed text-indigo-950 font-display font-bold text-xl px-7 py-3 rounded-full"
          >
            {pending === HOST_KEY ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
            {hostTaken ? 'Ya hay alguien moderando' : 'Entrar como moderación'}
          </button>
        </div>
        {pinError && <p className="mt-3 text-rose-200 font-bold">{pinError}</p>}
      </form>
    </div>
  );
}
