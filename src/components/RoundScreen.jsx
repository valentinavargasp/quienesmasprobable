import { useMemo } from 'react';
import { Hourglass } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { PEOPLE } from '../data/people';
import { tally } from '../lib/tally';
import { useCountdown } from '../hooks/useCountdown';
import { Confetti } from './ui';
import VoteBoard from './VoteBoard';
import Results from './Results';
import CountdownOverlay from './CountdownOverlay';
import HostMissing from './HostMissing';
import { QuestionCard, RoundHeader } from './RoundParts';

export default function RoundScreen({ g }) {
  const { game, votes, myName, hostOnline, candidates, presence } = g;
  const round = game.round || 0;
  const phase = game.phase || 'waiting';
  const question = QUESTIONS[round];
  const roundVotes = votes[round] || {};
  const { countValue, votingOpen, showOverlay } = useCountdown(game, g.serverNow);

  const voters = useMemo(
    () => candidates.filter((n) => presence[n] || roundVotes[n]),
    [candidates, presence, roundVotes]
  );
  const result = useMemo(() => tally(roundVotes, candidates), [roundVotes, candidates]);
  const active = PEOPLE.filter((p) => candidates.includes(p.name));

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
      <RoundHeader round={round} />

      {!hostOnline && (
        <div className="mb-6">
          <HostMissing />
        </div>
      )}

      <QuestionCard round={round} />

      <div className="mt-6">
        {phase !== 'revealed' ? (
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
        ) : (
          <>
            <Results active={active} votes={result.counts} winners={result.winners} question={question} />
            <div className="flex justify-center mt-7">
              <div className="flex items-center gap-3 bg-white/15 border border-white/25 text-white rounded-full px-6 py-3 font-bold">
                <Hourglass className="w-5 h-5 animate-pulse" /> Esperando la siguiente ronda…
              </div>
            </div>
            <Confetti key={`confetti-${round}`} />
          </>
        )}
      </div>

      {showOverlay && <CountdownOverlay value={countValue} />}
    </div>
  );
}
