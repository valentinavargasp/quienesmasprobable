import { PEOPLE } from '../data/people';
import { QUESTIONS } from '../data/questions';
import { Confetti } from './ui';
import Results from './Results';
import EasterEgg from './EasterEgg';
import { QuestionCard, RoundHeader } from './RoundParts';

// Solo en desarrollo (?demo=reveal&round=3&winner=Esteban): una ronda ya revelada con votos inventados.
export default function RevealDemo() {
  const params = new URLSearchParams(window.location.search);
  const round = Math.min(Math.max((Number(params.get('round')) || 3) - 1, 0), QUESTIONS.length - 1);
  const names = PEOPLE.map((p) => p.name);
  const winners = (params.get('winner') || names[1]).split(',').filter((n) => names.includes(n));
  const votes = Object.fromEntries(names.map((n, i) => [n, winners.includes(n) ? 3 : i % 2]));
  const question = QUESTIONS[round];

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
      <RoundHeader round={round} />
      <QuestionCard round={round} />
      <div className="mt-6">
        <Results active={PEOPLE} votes={votes} winners={winners} question={question} />
        <EasterEgg key={round} easterEgg={question.easterEgg} winners={winners} />
        <Confetti key={`confetti-${round}`} />
      </div>
    </div>
  );
}
