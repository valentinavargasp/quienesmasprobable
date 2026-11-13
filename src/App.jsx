import { useMemo } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { isConfigured } from './lib/firebase';
import { tally } from './lib/tally';
import { PEOPLE } from './data/people';
import { QUESTIONS } from './data/questions';
import { ROOM, useGame } from './hooks/useGame';
import { Card } from './components/ui';
import IdentifyScreen from './components/IdentifyScreen';
import LobbyScreen from './components/LobbyScreen';
import RoundScreen from './components/RoundScreen';
import FinalScreen from './components/FinalScreen';
import ModeratorScreen from './components/ModeratorScreen';
import TopBar from './components/TopBar';
import HostMissing from './components/HostMissing';
import CertificateDemo from './components/CertificateDemo';
import RevealDemo from './components/RevealDemo';

const DEMO = import.meta.env.DEV && new URLSearchParams(window.location.search).get('demo');

function CenterCard({ icon: Icon, title, children, spin }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-lg w-full p-8 text-center">
        <Icon className={`w-12 h-12 mx-auto text-indigo-500 ${spin ? 'animate-spin' : ''}`} />
        <h1 className="font-display font-bold text-2xl text-slate-900 mt-4">{title}</h1>
        {children && <div className="text-slate-500 font-semibold mt-2">{children}</div>}
      </Card>
    </div>
  );
}

function Game() {
  const g = useGame();

  const history = useMemo(
    () =>
      QUESTIONS.map((_, i) => {
        const roundVotes = g.votes[i];
        if (!roundVotes) return null;
        const { counts, winners } = tally(roundVotes, g.candidates);
        return winners.length ? { votes: counts, winners } : null;
      }),
    [g.votes, g.candidates]
  );

  if (g.authError) {
    return (
      <CenterCard icon={AlertTriangle} title="No se pudo conectar">
        Ocurrió un problema al ingresar a la sala. Intentá recargar la página.
      </CenterCard>
    );
  }
  if (!g.ready) return <CenterCard icon={Loader2} spin title="Conectando con la sala…" />;

  if (!g.myKey) {
    if (g.restoring) return <CenterCard icon={Loader2} spin title="Recuperando tu lugar en la sala…" />;
    return <IdentifyScreen presence={g.presence} gameStatus={g.game?.status} onClaim={g.claim} />;
  }

  const topBar = <TopBar myName={g.myName} isHost={g.isHost} connected={g.connected} room={ROOM} onLeave={g.release} />;

  if (g.isHost) {
    return (
      <>
        {topBar}
        <ModeratorScreen g={g} history={history} />
      </>
    );
  }

  const status = g.game?.status || 'lobby';

  return (
    <>
      {topBar}
      {status === 'playing' && <RoundScreen g={g} />}
      {status === 'final' && !g.hostOnline && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <HostMissing />
        </div>
      )}
      {status === 'final' && (
        <FinalScreen
          active={PEOPLE.filter((p) => g.candidates.includes(p.name))}
          history={history}
          isHost={false}
          myName={g.myName}
        />
      )}
      {status === 'lobby' && <LobbyScreen g={g} />}
    </>
  );
}

export default function App() {
  if (DEMO === 'certificado') return <CertificateDemo />;
  if (DEMO === 'reveal') return <RevealDemo />;
  if (!isConfigured) {
    return (
      <CenterCard icon={AlertTriangle} title="Servicio no disponible">
        No se pudo establecer la conexión con el servidor en este momento.
      </CenterCard>
    );
  }
  return (
    <div className="min-h-screen pb-10">
      <Game />
    </div>
  );
}
