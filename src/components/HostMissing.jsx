import { ShieldAlert } from 'lucide-react';

export default function HostMissing() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-2xl px-4 py-3 font-bold text-center">
      <ShieldAlert className="w-5 h-5" />
      La moderación no está conectada. La partida sigue apenas vuelva.
    </div>
  );
}
