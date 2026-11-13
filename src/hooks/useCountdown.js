import { useEffect, useState } from 'react';
import { useBeep } from './useBeep';

const STEPS = [
  { until: 900, value: 3 },
  { until: 1800, value: 2 },
  { until: 2700, value: 1 },
  { until: 4000, value: '¡YA!' },
];
const VOTING_OPENS_AT = 2700;

export function useCountdown(game, serverNow) {
  const phase = game?.phase || 'waiting';
  const [now, setNow] = useState(() => serverNow());
  const countdownAt = typeof game?.countdownAt === 'number' ? game.countdownAt : null;
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

  return { countValue, votingOpen, showOverlay: phase === 'voting' };
}
