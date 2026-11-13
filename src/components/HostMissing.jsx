import { ShieldAlert } from 'lucide-react';

export default function HostMissing({ hostName, onTakeOver }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-2xl px-4 py-3 font-bold">
      <ShieldAlert className="w-5 h-5" />
      {hostName ? `${hostName} (moderación) se desconectó.` : 'Nadie está moderando.'}
      <button onClick={onTakeOver} className="btn-press bg-rose-600 hover:bg-rose-500 text-white rounded-full px-4 py-1.5">
        Tomar la moderación
      </button>
    </div>
  );
}
