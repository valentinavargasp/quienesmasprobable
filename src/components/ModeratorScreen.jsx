import { useCallback, useMemo, useState } from 'react';
import { Check, ChevronRight, Copy, Hourglass, Link2, Play, RotateCcw, Sparkles, Timer, Trophy } from 'lucide-react';
import { PEOPLE } from '../data/people';
import { QUESTIONS, TOTAL_ROUNDS } from '../data/questions';
import { tally } from '../lib/tally';
import { ROOM } from '../hooks/useGame';
import { useCountdown } from '../hooks/useCountdown';
import { Card, Confetti, ConfirmDialog } from './ui';
import { PlayersGrid, RulesCard } from './LobbyScreen';
import { QuestionCard, RoundHeader, VoteProgress } from './RoundParts';
import Results from './Results';
import EasterEgg from './EasterEgg';
import CountdownOverlay from './CountdownOverlay';
import FinalScreen from './FinalScreen';

const JOIN_URL = `${window.location.origin}${window.location.pathname}${ROOM === 'weekly' ? '' : `?sala=${ROOM}`}`;

const PRIMARY =
  'btn-press inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 disabled:bg-white/20 disabled:text-white/50 disabled:cursor-not-allowed text-indigo-950 font-display font-bold text-lg md:text-xl px-6 py-3 rounded-full whitespace-nowrap';

function JoinLink() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JOIN_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <Card className="p-5 md:p-7 animate-fadeUp">
      <div className="text-sm font-extrabold uppercase tracking-widest text-indigo-500">Link para ingresar</div>
      <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-indigo-50 rounded-2xl px-4 py-3 min-w-0">
          <Link2 className="w-7 h-7 text-indigo-500 shrink-0" />
          <span className="font-display font-bold text-2xl md:text-4xl text-indigo-900 break-all">{JOIN_URL}</span>
        </div>
        <button
          onClick={copy}
          className="btn-press inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl px-5 py-4"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />} {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </Card>
  );
}

function RoundView({ g, countValue, showOverlay, result, voters, roundVotes }) {
  const round = g.game.round || 0;
  const revealed = g.game.phase === 'revealed';
  const active = PEOPLE.filter((p) => g.candidates.includes(p.name));

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
      <RoundHeader round={round} />
      <QuestionCard round={round} big />

      <div className="mt-6">
        {revealed ? (
          <>
            <Results active={active} votes={result.counts} winners={result.winners} question={QUESTIONS[round]} />
            <EasterEgg key={round} easterEgg={QUESTIONS[round].easterEgg} winners={result.winners} />
            <Confetti key={`confetti-${round}`} />
          </>
        ) : (
          <Card className="p-5 md:p-7">
            <VoteProgress voters={voters} roundVotes={roundVotes} />
          </Card>
        )}
      </div>

      {showOverlay && <CountdownOverlay value={countValue} />}
    </div>
  );
}

export default function ModeratorScreen({ g, history }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const { game, votes, candidates, presence } = g;
  const status = game?.status || 'lobby';
  const round = game?.round || 0;
  const phase = game?.phase || 'waiting';
  const roundVotes = useMemo(() => (status === 'playing' ? votes[round] || {} : {}), [status, votes, round]);
  const { countValue, showOverlay } = useCountdown(status === 'playing' ? game : null, g.serverNow);

  const voters = useMemo(
    () => candidates.filter((n) => presence[n] || roundVotes[n]),
    [candidates, presence, roundVotes]
  );
  const result = useMemo(() => tally(roundVotes, candidates), [roundVotes, candidates]);
  const online = g.onlineNames.length;
  const pendingVotes = voters.filter((n) => !roundVotes[n]).length;

  const doReset = useCallback(async () => {
    setConfirmReset(false);
    await g.resetGame();
  }, [g]);
  const cancelReset = useCallback(() => setConfirmReset(false), []);

  let help = null;
  let action = null;
  if (status === 'lobby') {
    help = online >= 2 ? `Empiezan ${online} jugadores.` : 'Hacen falta al menos 2 jugadores conectados.';
    action = (
      <button onClick={g.startGame} disabled={online < 2} className={PRIMARY}>
        <Play className="w-5 h-5 fill-current" /> Comenzar Juego
      </button>
    );
  } else if (status === 'playing' && phase === 'waiting') {
    help = 'Leé la pregunta en voz alta y lanzá la cuenta.';
    action = (
      <button onClick={g.startCountdown} className={PRIMARY}>
        <Timer className="w-5 h-5" /> Iniciar cuenta (3, 2, 1, ¡YA!)
      </button>
    );
  } else if (status === 'playing' && phase === 'voting') {
    help =
      result.total === 0
        ? 'Se habilita cuando llegue el primer voto.'
        : pendingVotes === 0
          ? '¡Votaron todos! Ya podés revelar.'
          : `Faltan ${pendingVotes} votos (podés revelar igual).`;
    action = (
      <button onClick={g.reveal} disabled={result.total === 0} className={PRIMARY}>
        <Sparkles className="w-5 h-5" /> Revelar
      </button>
    );
  } else if (status === 'playing' && phase === 'revealed') {
    const isLast = round >= TOTAL_ROUNDS - 1;
    help = 'Que cumpla la consigna y pasá de ronda.';
    action = (
      <button onClick={g.nextRound} className={PRIMARY}>
        {isLast ? (
          <>
            Ver los Premios <Trophy className="w-5 h-5" />
          </>
        ) : (
          <>
            Siguiente ronda <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    );
  } else if (status === 'final') {
    help = 'Partida terminada. ¡Felicitaciones a los premiados!';
  }

  return (
    <div className="pb-32">
      {status === 'lobby' && (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
          <header className="text-center text-white animate-fadeUp">
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.05]">¿Quién es más probable que…?</h1>
            <p className="mt-3 text-lg md:text-xl text-white/85 font-semibold">Sala de espera · {TOTAL_ROUNDS} rondas</p>
          </header>
          <div className="mt-8">
            <JoinLink />
          </div>
          <div className="grid md:grid-cols-5 gap-6 mt-6">
            <PlayersGrid presence={presence} className="md:col-span-3" />
            <RulesCard className="md:col-span-2" />
          </div>
        </div>
      )}

      {status === 'playing' && (
        <RoundView
          g={g}
          countValue={countValue}
          showOverlay={showOverlay}
          result={result}
          voters={voters}
          roundVotes={roundVotes}
        />
      )}

      {status === 'final' && (
        <FinalScreen
          active={PEOPLE.filter((p) => candidates.includes(p.name))}
          history={history}
          isHost
          onRestart={g.resetGame}
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 bg-indigo-950/85 backdrop-blur border-t border-white/15">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap items-center gap-3">
          <button
            onClick={() => setConfirmReset(true)}
            className="btn-press inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold rounded-full px-4 py-2.5 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" /> Reiniciar partida
          </button>
          <p className="order-last md:order-none w-full md:w-auto md:flex-1 text-center text-white/85 font-bold flex items-center justify-center gap-2">
            {status === 'playing' && phase === 'voting' && pendingVotes > 0 && <Hourglass className="w-4 h-4 animate-pulse shrink-0" />}
            {help}
          </p>
          <div className="ml-auto md:ml-0">{action}</div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="¿Reiniciar la partida?"
        message="Se borran todos los votos y todos vuelven a la sala de espera. Los jugadores siguen conectados."
        confirmLabel="Sí, reiniciar"
        onConfirm={doReset}
        onCancel={cancelReset}
      />
    </div>
  );
}
