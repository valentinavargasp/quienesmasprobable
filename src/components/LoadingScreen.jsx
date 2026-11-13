const TITLE = '¿Quién es más probable que…?';

// Agrupa las letras por palabra (para que el salto de línea nunca corte una
// palabra) y conserva un índice global para escalonar las animaciones.
const WORDS = TITLE.split(' ').reduce((acc, word) => {
  const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].chars.length : 0;
  acc.push({ start, chars: [...word] });
  return acc;
}, []);

export default function LoadingScreen({ room, leaving }) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center text-white transition-opacity duration-[400ms] ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <h1
        aria-label={TITLE}
        className="font-display font-bold text-5xl md:text-7xl leading-tight max-w-4xl drop-shadow-[0_4px_12px_rgba(30,27,75,0.35)]"
      >
        {WORDS.map(({ start, chars }, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {chars.map((ch, c) => {
                const i = start + c;
                return (
                  <span
                    key={c}
                    aria-hidden="true"
                    className="inline-block animate-fadeUp"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <span
                      className="inline-block text-white animate-wave-glow motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {ch}
                    </span>
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </h1>

      <p role="status" aria-live="polite" className="mt-8 text-2xl md:text-3xl font-extrabold text-white/90">
        Conectando con la sala
        <span aria-hidden="true">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="animate-dots motion-reduce:animate-none"
              style={{ animationDelay: `${d * 0.2}s` }}
            >
              .
            </span>
          ))}
        </span>
      </p>

      <p className="mt-3 text-base text-white/60">Sala: {room}</p>
    </div>
  );
}
