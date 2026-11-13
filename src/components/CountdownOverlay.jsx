export default function CountdownOverlay({ value }) {
  if (value === null) return null;
  const isGo = value === '¡YA!';

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/75 backdrop-blur-sm flex items-center justify-center" role="status" aria-live="assertive">
      <div className="relative flex items-center justify-center">
        <span
          key={`ring-${value}`}
          className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full ${isGo ? 'bg-yellow-300/40' : 'bg-white/20'} animate-ring`}
        />
        <div
          key={value}
          className={`animate-pop font-display font-bold drop-shadow-2xl leading-none ${
            isGo ? 'text-yellow-300 text-[9rem] md:text-[14rem]' : 'text-white text-[12rem] md:text-[18rem]'
          }`}
        >
          {value}
        </div>
      </div>
      {isGo && (
        <p className="absolute bottom-16 text-white text-2xl md:text-3xl font-display font-bold animate-fadeUp">
          ¡Elegí tu voto!
        </p>
      )}
    </div>
  );
}
