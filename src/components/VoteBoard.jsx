import { useEffect, useState } from 'react';
import { Check, Hourglass, Loader2, Lock, Send, Vote } from 'lucide-react';
import { personOf } from '../data/people';
import { Avatar, Card } from './ui';
import { VoteProgress } from './RoundParts';

export default function VoteBoard({ candidates, voters, roundVotes, myName, votingOpen, countdownStarted, round, onVote }) {
  const [selected, setSelected] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const myVote = roundVotes[myName];
  const amCandidate = candidates.includes(myName);

  useEffect(() => {
    setSelected(null);
    setError(null);
  }, [round]);

  const confirm = async () => {
    if (!selected) return;
    setSending(true);
    setError(null);
    const ok = await onVote(selected);
    if (!ok) setError('No se pudo registrar el voto (puede que ya hayas votado).');
    setSending(false);
  };

  const progress = (
    <div className="mt-6 pt-5 border-t border-slate-100">
      <VoteProgress voters={voters} roundVotes={roundVotes} />
    </div>
  );

  let body;
  if (!amCandidate) {
    body = <p className="text-slate-500 font-bold text-center py-4">Estás mirando esta partida. Vas a poder votar desde la próxima ronda.</p>;
  } else if (myVote) {
    const p = personOf(myVote);
    body = (
      <div className="flex flex-col items-center text-center py-4 animate-pop">
        <div className="relative">
          <Avatar name={myVote} size="w-20 h-20 text-4xl" />
          <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
            <Check className="w-5 h-5" strokeWidth={3} />
          </span>
        </div>
        <p className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-4">
          ¡Votaste a <span className={p.text}>{myVote === myName ? 'vos mismo/a' : myVote}</span>!
        </p>
        <p className="text-slate-500 font-bold mt-1 flex items-center gap-1.5">
          <Lock className="w-4 h-4" /> Tu voto quedó registrado. Esperando al resto…
        </p>
      </div>
    );
  } else if (!votingOpen) {
    body = (
      <div className="flex flex-col items-center text-center py-6 text-slate-500">
        <Hourglass className="w-10 h-10 text-indigo-400 animate-pulse" />
        <p className="font-display font-bold text-2xl text-slate-800 mt-3">
          {countdownStarted ? 'Preparate…' : 'Esperando la cuenta regresiva'}
        </p>
        <p className="font-semibold mt-1">La votación se abre en todas las pantallas al mismo tiempo, cuando sale el ¡YA!</p>
      </div>
    );
  } else {
    body = (
      <>
        <p className="font-bold text-slate-500 mb-4">Elegí a una persona y confirmá. Solo podés votar una vez.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {candidates.map((n) => {
            const p = personOf(n);
            const isSel = selected === n;
            return (
              <button
                key={n}
                onClick={() => setSelected(n)}
                aria-pressed={isSel}
                className={`btn-press relative rounded-2xl p-4 border-2 flex items-center gap-3 text-left ${
                  isSel ? `${p.soft} ${p.border} ring-4 ring-indigo-200 shadow-lg -translate-y-0.5` : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow'
                }`}
              >
                <Avatar name={n} size="w-11 h-11 text-lg" />
                <span className="font-extrabold text-slate-900 truncate">
                  {n} {n === myName && <span className="text-xs text-slate-400">(vos)</span>}
                </span>
                {isSel && (
                  <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${p.solid} text-white flex items-center justify-center shadow animate-pop`}>
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col items-center mt-6">
          <button
            onClick={confirm}
            disabled={!selected || sending}
            className="btn-press inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-display font-bold text-xl px-8 py-4 rounded-full shadow-[0_6px_0_0_#312e81] disabled:shadow-none"
          >
            {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            {selected ? `Confirmar voto por ${selected === myName ? 'mí' : selected}` : 'Elegí a alguien'}
          </button>
          {error && <p className="text-rose-600 font-bold mt-3">{error}</p>}
        </div>
      </>
    );
  }

  return (
    <Card className="p-5 md:p-7">
      <h3 className="font-display font-bold text-xl md:text-2xl text-slate-900 flex items-center gap-2 mb-4">
        <Vote className="w-6 h-6 text-indigo-500" /> Tu voto
      </h3>
      {body}
      {progress}
    </Card>
  );
}
