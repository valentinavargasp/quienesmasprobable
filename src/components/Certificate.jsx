import { forwardRef, useState } from 'react';
import { Award, Sparkles } from 'lucide-react';
import { BRAND } from '../data/brand';
import { personOf } from '../data/people';
import { plural } from './ui';

export const CERT_WIDTH = 1200;
export const CERT_HEIGHT = 850;

const GOLD = 'linear-gradient(135deg, #fde68a 0%, #f59e0b 45%, #b45309 100%)';
const GAME = 'linear-gradient(90deg, #7c3aed 0%, #c026d3 50%, #db2777 100%)';

function BrandMark() {
  const [failed, setFailed] = useState(!BRAND.logo);
  if (failed) {
    return <div className="font-display font-bold text-[40px] leading-none text-indigo-950 tracking-tight">{BRAND.name}</div>;
  }
  return <img src={BRAND.logo} alt={BRAND.name} onError={() => setFailed(true)} className="h-[56px] w-auto object-contain" />;
}

function Corner({ className }) {
  return (
    <svg viewBox="0 0 60 60" className={`absolute w-[60px] h-[60px] ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="cert-corner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <path d="M4 56 V4 H56" fill="none" stroke="url(#cert-corner)" strokeWidth="4" strokeLinecap="round" />
      <path d="M14 46 V14 H46" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="14" r="4" fill="#f59e0b" />
    </svg>
  );
}

const Certificate = forwardRef(function Certificate({ cert, date = new Date() }, ref) {
  const person = personOf(cert.name);
  const dateText = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      ref={ref}
      className="certificate relative overflow-hidden"
      style={{ width: CERT_WIDTH, height: CERT_HEIGHT, padding: 14, background: GAME }}
    >
      <div className="relative w-full h-full bg-[#fffaf0]" style={{ padding: 14 }}>
        <div className="relative w-full h-full border-[6px] border-double border-amber-500 flex flex-col items-center text-center px-[90px] pt-[38px] pb-[30px]">
          <Corner className="top-3 left-3" />
          <Corner className="top-3 right-3 rotate-90" />
          <Corner className="bottom-3 right-3 rotate-180" />
          <Corner className="bottom-3 left-3 -rotate-90" />

          <BrandMark />
          <div className="mt-2 text-[15px] font-extrabold uppercase tracking-[0.35em] text-slate-400">presenta</div>

          <h1 className="mt-5 font-display font-bold text-[50px] leading-none text-indigo-950">Certificado de Reconocimiento</h1>
          <div className="mt-4 h-[5px] w-[220px] rounded-full" style={{ background: GAME }} />

          <div className="mt-7 text-[22px] font-bold text-slate-500">Se otorga a</div>
          <div className={`font-display font-bold text-[92px] leading-[1.05] ${person?.text || 'text-indigo-700'}`}>{cert.name}</div>

          <div className="mt-3 text-[22px] font-bold text-slate-500">por haberse consagrado como</div>
          <div className="mt-3 inline-flex items-center gap-3 rounded-full border-[3px] border-amber-400 bg-amber-50 px-9 py-3">
            <Sparkles className="w-8 h-8 text-amber-500 shrink-0" />
            <span className="font-display font-bold text-[40px] leading-tight text-indigo-950">{cert.award}</span>
            <Sparkles className="w-8 h-8 text-amber-500 shrink-0" />
          </div>

          <p className="mt-6 max-w-[880px] text-[21px] leading-snug font-semibold italic text-slate-600">
            Por ser, según el voto del equipo, la persona más probable que {cert.q}.
          </p>
          <div className="mt-3 text-[16px] font-extrabold text-slate-400">
            {plural(cert.votes, 'voto')} · Ronda {cert.round} · {cert.cat}
            {cert.shared && <span className="text-fuchsia-600"> · Título compartido</span>}
          </div>

          <div className="mt-auto w-full flex items-end justify-between">
            <div className="w-[300px] text-left">
              <div className="text-[19px] font-extrabold text-slate-700">{dateText}</div>
              <div className="text-[15px] font-bold text-slate-400">Weekly del equipo</div>
            </div>

            <div
              className="w-[118px] h-[118px] rounded-full flex items-center justify-center shadow-lg"
              style={{ background: GOLD }}
            >
              <div className="w-[96px] h-[96px] rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center text-white">
                <Award className="w-11 h-11" strokeWidth={2.2} />
                <span className="text-[11px] font-extrabold uppercase tracking-widest mt-0.5">Weekly</span>
              </div>
            </div>

            <div className="w-[300px] text-right flex flex-col items-end">
              <div className="w-[240px] border-b-2 border-slate-400 mb-2" />
              <div className="text-[15px] font-bold text-slate-500">Moderación de la Weekly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Certificate;
