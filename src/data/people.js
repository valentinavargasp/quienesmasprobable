export const PEOPLE = [
  { name: 'Valentina', solid: 'bg-violet-500', soft: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-300', bar: 'from-violet-500 to-fuchsia-500' },
  { name: 'Esteban', solid: 'bg-sky-500', soft: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-300', bar: 'from-sky-500 to-cyan-400' },
  { name: 'Solange', solid: 'bg-pink-500', soft: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-300', bar: 'from-pink-500 to-rose-400' },
  { name: 'Alberto', solid: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', bar: 'from-amber-500 to-yellow-400' },
  { name: 'Luisa', solid: 'bg-emerald-500', soft: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', bar: 'from-emerald-500 to-teal-400' },
  { name: 'Sebastián', solid: 'bg-orange-500', soft: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', bar: 'from-orange-500 to-red-400' },
];

export const DEFAULT_HOST = 'Valentina';

export const personOf = (name) => PEOPLE.find((p) => p.name === name);
