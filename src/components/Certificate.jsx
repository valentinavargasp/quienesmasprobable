import { forwardRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import { BRAND } from '../data/brand';
import { personOf } from '../data/people';
import { plural } from './ui';

export const CERT_WIDTH = 1200;
export const CERT_HEIGHT = 850;

const BACKGROUND = [
  'radial-gradient(circle at 88% 12%, rgba(219, 39, 119, 0.45) 0, transparent 38%)',
  'radial-gradient(circle at 8% 95%, rgba(124, 58, 237, 0.6) 0, transparent 45%)',
  'radial-gradient(circle at 70% 105%, rgba(245, 158, 11, 0.22) 0, transparent 35%)',
  'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
].join(', ');
const GOLD = 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #d97706 100%)';

function BrandMark() {
  const [failed, setFailed] = useState(!BRAND.logo);
  if (failed) {
    return <div className="font-display font-bold text-[40px] leading-none text-white tracking-tight">{BRAND.name}</div>;
  }
  return <img src={BRAND.logo} alt={BRAND.name} onError={() => setFailed(true)} className="h-[56px] w-auto object-contain" />;
}

function Chip({ children, className = 'bg-white/10 text-white/80' }) {
  return <span className={`rounded-full px-4 py-1.5 text-[15px] font-extrabold ${className}`}>{children}</span>;
}

const Certificate = forwardRef(function Certificate({ cert, date = new Date() }, ref) {
  const person = personOf(cert.name);
  const dateText = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden text-white"
      style={{ width: CERT_WIDTH, height: CERT_HEIGHT, background: BACKGROUND }}
    >
      <div className="absolute inset-[24px] rounded-[28px] border border-white/15" />

      <div
        className="absolute right-[96px] top-[250px] w-[230px] h-[230px] rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: GOLD }}
      >
        <div className="w-[196px] h-[196px] rounded-full border-2 border-dashed border-white/70 flex flex-col items-center justify-center text-indigo-950">
          <Trophy className="w-[72px] h-[72px]" strokeWidth={1.8} />
          <span className="mt-2 text-[15px] font-extrabold uppercase tracking-[0.3em]">Weekly</span>
          <span className="font-display font-bold text-[28px] leading-none mt-1">#{cert.round}</span>
        </div>
      </div>

      <div className="relative h-full flex flex-col px-[72px] pt-[64px] pb-[60px]">
        <div className="flex items-center justify-between">
          <BrandMark />
          <span className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-[14px] font-extrabold uppercase tracking-[0.3em] text-white/80">
            Certificado de reconocimiento
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[760px]">
          <div className="text-[16px] font-extrabold uppercase tracking-[0.35em] text-amber-300">Se otorga a</div>
          <div className="mt-2 font-display font-bold text-[120px] leading-none tracking-tight">{cert.name}</div>
          <div className={`mt-5 h-[8px] w-[180px] rounded-full bg-gradient-to-r ${person?.bar || 'from-violet-500 to-fuchsia-500'}`} />

          <div className="mt-8 text-[24px] font-bold text-white/70">por haberse consagrado como</div>
          <div className="mt-3">
            <span
              className="inline-block rounded-2xl px-6 py-2 font-display font-bold text-[46px] leading-tight text-indigo-950"
              style={{ background: GOLD }}
            >
              {cert.award}
            </span>
          </div>

          <p className="mt-6 text-[21px] leading-snug font-semibold text-white/75">
            Por ser, según el voto del equipo, la persona más probable que {cert.q}.
          </p>
        </div>

        <div className="flex items-end justify-between gap-6 border-t border-white/15 pt-6">
          <div>
            <div className="text-[20px] font-extrabold">{dateText}</div>
            <div className="text-[15px] font-bold text-white/60">Weekly del equipo</div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Chip>{plural(cert.votes, 'voto')}</Chip>
            <Chip>Ronda {cert.round}</Chip>
            <Chip>{cert.cat}</Chip>
            {cert.shared && <Chip className="bg-fuchsia-500/25 text-fuchsia-200">Título compartido</Chip>}
          </div>

          <div className="flex flex-col items-end">
            <div className="w-[220px] border-b-2 border-white/40 mb-2" />
            <div className="text-[15px] font-bold text-white/70">Moderación de la Weekly</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Certificate;
