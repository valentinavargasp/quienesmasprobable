import { LogOut, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { Avatar } from './ui';

export default function TopBar({ myName, isHost, connected, room, onLeave }) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <div className="flex items-center justify-between gap-3 bg-white/15 border border-white/25 backdrop-blur rounded-2xl px-3 py-2 text-white">
        <div className="flex items-center gap-3 min-w-0">
          {isHost ? (
            <div className="w-9 h-9 rounded-2xl bg-yellow-300 text-indigo-950 flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          ) : (
            <Avatar name={myName} size="w-9 h-9 text-base" />
          )}
          <div className="min-w-0">
            <div className="font-extrabold leading-tight truncate">{isHost ? 'Moderación' : `Sos ${myName}`}</div>
            <div className="text-xs text-white/75 font-bold">Sala: {room}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`hidden sm:flex items-center gap-1 text-xs font-extrabold ${connected ? 'text-emerald-200' : 'text-rose-200'}`}>
            {connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {connected ? 'Conectado' : 'Reconectando…'}
          </span>
          <button onClick={onLeave} className="flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white">
            <LogOut className="w-4 h-4" /> {isHost ? 'Salir' : 'No soy yo'}
          </button>
        </div>
      </div>
    </div>
  );
}
