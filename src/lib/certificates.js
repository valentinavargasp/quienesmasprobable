import { QUESTIONS } from '../data/questions';

// Un certificado por cada ganador de cada ronda; en un empate, uno por persona con shared: true.
export function buildCertificates(history, questions = QUESTIONS) {
  return questions.flatMap((question, i) => {
    const h = history[i];
    if (!h) return [];
    const shared = h.winners.length > 1;
    return h.winners.map((name) => ({
      name,
      award: question.award,
      q: question.q,
      cat: question.cat,
      round: i + 1,
      votes: h.votes[name] || 0,
      shared,
    }));
  });
}

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const certificateFileName = (c) => `certificado-${slug(c.name)}-${slug(c.award)}.png`;
