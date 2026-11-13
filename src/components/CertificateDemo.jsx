import { useCallback, useMemo, useState } from 'react';
import { PEOPLE } from '../data/people';
import { QUESTIONS } from '../data/questions';
import { buildCertificates } from '../lib/certificates';
import FinalScreen from './FinalScreen';
import CertificateModal from './CertificateModal';

// Solo en desarrollo (?demo=certificado): una partida inventada para ver la pantalla final y los certificados.
const DEMO_ME = 'Valentina';

function demoHistory() {
  const names = PEOPLE.map((p) => p.name);
  return QUESTIONS.map((_, i) => {
    const winners = i === 3 ? [names[0], names[2]] : [names[i % names.length]];
    const votes = Object.fromEntries(names.map((n) => [n, winners.includes(n) ? 3 : (i + n.length) % 2]));
    return { votes, winners };
  });
}

export default function CertificateDemo() {
  const history = useMemo(demoHistory, []);
  const [cert, setCert] = useState(() => buildCertificates(history).find((c) => c.name === DEMO_ME));
  const close = useCallback(() => setCert(null), []);

  return (
    <div className="min-h-screen pb-10">
      <FinalScreen active={PEOPLE} history={history} isHost={false} myName={DEMO_ME} />
      {cert && <CertificateModal cert={cert} onClose={close} />}
    </div>
  );
}
