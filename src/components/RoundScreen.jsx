import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Hourglass, Sparkles, Timer, Trophy } from 'lucide-react';
import { CATEGORIES, QUESTIONS, TOTAL_ROUNDS } from '../data/questions';
import { PEOPLE } from '../data/people';
import { tally } from '../lib/tally';
import { useBeep } from '../hooks/useBeep';
import { Card, Confetti } from './ui';
import VoteBoard from './VoteBoard';
import Results from './Results';
import CountdownOverlay from './CountdownOverlay';
import HostMissing from './HostMissing';

const STEPS = [
  { until: 900, value: 3 },
  { until: 1800, value: 2 },
  { until: 2700, value: 1 },
  { until: 4000, value: '¡YA!' },
];
const VOTING_OPENS_AT = 2700;

export default function RoundScreen({ g }) {
  const { game, votes, myName, isHost, hostOnline, candidates, presence } = g;
  const round = game.round || 0;
  const phase = game.phase || 'waiting';
  const question = QUESTIONS[round];
  const cat = CATEGORIES[question.cat];
  const CatIcon = cat.icon;
  const roundVotes = votes[round] || {};
  const isLast = round === TOTAL_ROUNDS - 1;
  const revealed = phase === 'revealed';

  const { serverNow } = g;
  const [now, setNow] = useState(() => serverNow());
  const countdownAt = typeof game.countdownAt === 'number' ? game.countdownAt : null;
  useEffect(() => {
    if (!countdownAt) return undefined;
    setNow(serverNow());
    const id = setInterval(() => {
      const t = serverNow();
      setNow(t);
      if (t - countdownAt > 4500) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [countdownAt, serverNow]);

  const elapsed = countdownAt ? now - countdownAt : null;
  const countValue = elapsed !== null && elapsed >= 0 ? (STEPS.find((s) => elapsed < s.until)?.value ?? null) : null;
  const votingOpen = phase === 'voting' && elapsed !== null && elapsed >= VOTING_OPENS_AT;

  const { beep } = useBeep();
  useEffect(() => {
    if (countValue === null || phase !== 'voting') return;
    beep(countValue === '¡YA!' ? 880 : 520, countValue === '¡YA!' ? 0.4 : 0.15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countValue]);

  const voters = useMemo(
    () => candidates.filter((n) => presence[n] || roundVotes[n]),
    [candidates, presence, roundVotes]
  );
  const result = useMemo(() => tally(roundVotes, candidates), [roundVotes, candidates]);
  const active = PEOPLE.filter((p) => candidates.includes(p.name));
  const allVoted = voters.length > 0 && voters.every((n) => roundVotes[n]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
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

      {!hostOnline && (
        <div className="mb-6">
          <HostMissing hostName={game.host} onTakeOver={g.becomeHost} />
        </div>
      )}

      <Card key={round} className="p-7 md:p-12 text-center animate-fadeUp">
        <div className="text-indigo-500 font-display font-semibold text-xl md:text-2xl mb-3">¿Quién es más probable que…</div>
        <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight text-slate-900 max-w-4xl mx-auto">{question.q}?</h2>
        {isHost && phase === 'waiting' && (
          <button
            onClick={g.startCountdown}
            className="btn-press mt-8 inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold text-xl md:text-2xl px-8 py-4 rounded-full shadow-[0_6px_0_0_#312e81]"
          >
            <Timer className="w-7 h-7" /> Iniciar cuenta regresiva (3, 2, 1, ¡YA!)
          </button>
        )}
      </Card>

      <div className="mt-6">
        {!revealed ? (
          <>
            <VoteBoard
              candidates={candidates}
              voters={voters}
              roundVotes={roundVotes}
              myName={myName}
              votingOpen={votingOpen}
              countdownStarted={phase === 'voting'}
              round={round}
              onVote={g.vote}
            />
            {isHost && (
              <div className="flex flex-col items-center mt-6 gap-2">
                <button
                  onClick={g.reveal}
                  disabled={result.total === 0}
                  className="btn-press inline-flex items-center gap-3 bg-yellow-300 hover:bg-yellow-200 disabled:bg-white/40 disabled:cursor-not-allowed text-indigo-950 font-display font-bold text-xl md:text-2xl px-9 py-4 rounded-full shadow-[0_6px_0_0_rgba(30,27,75,.35)]"
                >
                  <Sparkles className="w-7 h-7" /> Revelar Ganador y Consigna
                </button>
                <p className="text-white/90 font-bold text-center">
                  {result.total === 0
                    ? 'Se habilita cuando llegue el primer voto.'
                    : allVoted
                      ? '¡Votaron todos! Ya podés revelar.'
                      : `Faltan ${voters.length - Object.keys(roundVotes).length} votos (podés revelar igual).`}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <Results active={active} votes={result.counts} winners={result.winners} question={question} />
            <div className="flex justify-center mt-7">
              {isHost ? (
                <button
                  onClick={g.nextRound}
                  className="btn-press inline-flex items-center gap-3 bg-white hover:bg-indigo-50 text-indigo-700 font-display font-bold text-xl md:text-2xl px-9 py-4 rounded-full shadow-[0_6px_0_0_rgba(30,27,75,.35)]"
                >
                  {isLast ? (
                    <>
                      Ver los Premios de la Weekly <Trophy className="w-7 h-7" />
                    </>
                  ) : (
                    <>
                      Siguiente ronda <ChevronRight className="w-7 h-7" />
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-white/15 border border-white/25 text-white rounded-full px-6 py-3 font-bold">
                  <Hourglass className="w-5 h-5 animate-pulse" /> Esperando que {game.host || 'la moderación'} pase de ronda…
                </div>
              )}
            </div>
            <Confetti key={`confetti-${round}`} />
          </>
        )}
      </div>

      {phase === 'voting' && <CountdownOverlay value={countValue} />}
    </div>
  );
}
