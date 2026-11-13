export function tally(roundVotes = {}, candidates = []) {
  const counts = Object.fromEntries(candidates.map((n) => [n, 0]));
  Object.values(roundVotes).forEach((target) => {
    if (target in counts) counts[target] += 1;
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const max = Math.max(0, ...Object.values(counts));
  const winners = max === 0 ? [] : candidates.filter((n) => counts[n] === max);
  return { counts, total, winners };
}
