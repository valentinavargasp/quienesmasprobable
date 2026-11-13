import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';
import { Download, GraduationCap, Loader2, X } from 'lucide-react';
import { certificateFileName } from '../lib/certificates';
import Certificate, { CERT_HEIGHT, CERT_WIDTH } from './Certificate';

export default function CertificateModal({ cert, onClose }) {
  const boxRef = useRef(null);
  const certRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const fit = () => setScale(Math.min(1, box.clientWidth / CERT_WIDTH));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const download = async () => {
    setBusy(true);
    setError(null);
    try {
      const url = await toPng(certRef.current, { pixelRatio: 2, width: CERT_WIDTH, height: CERT_HEIGHT, cacheBust: true });
      const a = document.createElement('a');
      a.href = url;
      a.download = certificateFileName(cert);
      a.click();
    } catch (e) {
      console.error('No se pudo generar el PNG', e);
      setError('No se pudo generar la imagen. Volvé a intentar en unos segundos.');
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] bg-indigo-950/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div className="min-h-full flex items-center justify-center p-4 md:p-8">
        <div
          className="w-full max-w-5xl"
          role="dialog"
          aria-modal="true"
          aria-label={`Certificado de ${cert.name}: ${cert.award}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 mb-3 text-white">
            <h2 className="font-display font-bold text-xl md:text-2xl flex items-center gap-2 min-w-0">
              <GraduationCap className="w-6 h-6 text-yellow-300 shrink-0" />
              <span className="truncate">
                {cert.name} · {cert.award}
              </span>
            </h2>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="btn-press w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={boxRef} className="rounded-2xl overflow-hidden shadow-2xl" style={{ height: CERT_HEIGHT * scale }}>
            <div className="origin-top-left" style={{ width: CERT_WIDTH, transform: `scale(${scale})` }}>
              <Certificate ref={certRef} cert={cert} />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={download}
              disabled={busy}
              className="btn-press inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 disabled:opacity-70 text-indigo-950 font-display font-bold text-lg px-6 py-3 rounded-full"
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} Descargar PNG
            </button>
          </div>
          {error && <p className="mt-3 text-center text-rose-200 font-bold">{error}</p>}
        </div>
      </div>
    </div>,
    document.body
  );
}
