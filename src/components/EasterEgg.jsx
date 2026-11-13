import { useState } from 'react';

// Sorpresa que aparece después del reveal, cuando la pregunta tiene `easterEgg`.
export default function EasterEgg({ easterEgg, winners }) {
  const [broken, setBroken] = useState(false);
  if (!easterEgg || broken) return null;

  const personal = winners.map((w) => easterEgg.personCaption?.[w]).find(Boolean);
  const caption = personal || easterEgg.caption;

  return (
    <div className="flex justify-center mt-8 px-2">
      {/* Rotación en el contenedor: el keyframe `pop` usa transform y la pisaría. */}
      <div className="w-full max-w-[420px] -rotate-3">
        <figure
          className="bg-white rounded-sm p-3 pb-5 sm:p-4 sm:pb-6 shadow-2xl shadow-indigo-950/40 animate-pop"
          style={{ animationDelay: '1.2s' }}
        >
          {easterEgg.title && (
            <div className="font-display font-bold text-lg md:text-xl text-slate-900 text-center mb-3">
              {easterEgg.title}
            </div>
          )}
          <img
            src={easterEgg.image}
            alt="Foto de una videollamada congelada"
            onError={() => setBroken(true)}
            className="w-full h-auto bg-slate-100"
          />
          {caption && (
            <figcaption className="font-display font-medium text-xl md:text-2xl text-slate-700 text-center leading-snug mt-4 -rotate-1">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  );
}
