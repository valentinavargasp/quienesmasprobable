import {
  Camera, Clapperboard, Clock, Coffee, Flame, Globe, Laptop, Laugh, MapPin, MicOff,
  Music, PawPrint, Shield, Shirt, ShoppingCart, Skull, Smartphone, Star,
} from 'lucide-react';

export const CATEGORIES = {
  'Modo Remoto': { icon: Laptop, chip: 'bg-sky-100 text-sky-800' },
  'Vida Cotidiana': { icon: Coffee, chip: 'bg-amber-100 text-amber-800' },
  'Caos Controlado': { icon: Flame, chip: 'bg-rose-100 text-rose-800' },
  Supervivencia: { icon: Skull, chip: 'bg-emerald-100 text-emerald-800' },
  Farándula: { icon: Star, chip: 'bg-fuchsia-100 text-fuchsia-800' },
};

// q: se muestra como "¿Quién es más probable que … ?"
// award: título que recibe el ganador (pantalla final y certificado).
export const QUESTIONS = [
  { cat: 'Modo Remoto', q: 'hable un minuto entero con el micrófono muteado antes de darse cuenta',
    tipo: 'Imitación', icon: MicOff, award: 'Premio Mute Eterno',
    consigna: 'Tiene 10 segundos para imitar su cara de pánico cuando se da cuenta de que estaba muteado/a.' },
  { cat: 'Caos Controlado', q: 'tenga más de 40 pestañas abiertas en el navegador en este mismo instante',
    tipo: '¡Prueba en vivo!', icon: Globe, award: 'Coleccionista de Pestañas',
    consigna: 'Tiene que decir el número exacto de pestañas abiertas ahora mismo (o compartir pantalla 5 segundos).' },
  { cat: 'Vida Cotidiana', q: 'le hable a su mascota o a su planta como si fuera compañera de trabajo',
    tipo: 'Presentación', icon: PawPrint, award: 'Mejor Equipo No Humano',
    consigna: 'Presentanos a tu "compañero/a de oficina" (mascota, planta u objeto) en 10 segundos.' },
  { cat: 'Vida Cotidiana', q: 'haya puesto a calentar agua para el mate o el café y se haya olvidado tres veces seguidas',
    tipo: 'Derecho a réplica', icon: Coffee, award: 'Medalla al Mate Olvidado',
    consigna: '¿Culpable o inocente? Contá cuál fue tu récord de veces recalentando la misma agua/café.' },
  { cat: 'Farándula', q: 'se vuelva viral en internet por accidente',
    tipo: 'Visión de futuro', icon: Smartphone, award: 'Futura Celebridad',
    consigna: 'En 5 segundos: ¿de qué sería tu video viral?' },
  { cat: 'Caos Controlado', q: 'diga "esto es un cambio de 5 minutos" y termine demorando tres días',
    tipo: 'Confesión rápida', icon: Clock, award: 'Estimador/a Optimista del Año',
    consigna: '¿Cuál fue la tarea "fácil" que más se te complicó últimamente?' },
  { cat: 'Modo Remoto', q: 'tenga un caos absoluto justo afuera del cuadro de la cámara',
    tipo: 'Tour verbal', icon: Camera, award: 'Maestría en Encuadre',
    consigna: 'Describí en 10 segundos qué hay a medio metro de vos, justo fuera de cámara.' },
  { cat: 'Vida Cotidiana', q: 'tenga una canción vergonzosa en loop para concentrarse',
    tipo: 'Confesión musical', icon: Music, award: 'DJ del Placer Culposo',
    consigna: 'Confesá la canción más culposa que escuchaste esta semana (cantar el estribillo es opcional, pero suma puntos).' },
  { cat: 'Modo Remoto', q: 'esté en pijama o pantuflas de la cintura para abajo durante esta reunión',
    tipo: 'Autoevaluación', icon: Shirt, award: 'Outfit Ejecutivo Mitad y Mitad',
    consigna: 'Sin mostrar la cámara hacia abajo, describí tu outfit de hoy del 1 al 10 en nivel de comodidad.' },
  { cat: 'Supervivencia', q: 'sobreviva más tiempo en un apocalipsis zombie',
    tipo: 'Estrategia', icon: Shield, award: 'Última Persona en Pie',
    consigna: 'El equipo confía en vos: tirá tu primer movimiento estratégico si hoy arranca el apocalipsis.' },
  { cat: 'Modo Remoto', q: 'haya respondido un mensaje de trabajo desde el lugar más insólito',
    tipo: 'Anécdota', icon: MapPin, award: 'Oficina Móvil',
    consigna: 'Contá desde dónde fue: súper, cola del banco, peluquería…' },
  { cat: 'Vida Cotidiana', q: 'termine comprando algo totalmente innecesario en internet a las 3 de la mañana',
    tipo: 'Confesión', icon: ShoppingCart, award: 'Carrito de Medianoche',
    consigna: 'Confesá cuál fue la compra más random o inútil que hiciste por internet.' },
  { cat: 'Farándula', q: 'gane un reality show',
    tipo: 'Casting', icon: Clapperboard, award: 'Favorito/a del Público',
    consigna: 'Presentate como en el primer episodio: nombre, frase de batalla y pose.' },
  { cat: 'Modo Remoto', q: 'se ría solo leyendo un mensaje en medio de una reunión seria y tenga que disimular',
    tipo: 'Desafío actoral', icon: Laugh, award: 'Óscar a la Risa Contenida',
    consigna: 'Mostranos tu mejor "cara de reunión seria" mientras te intentás aguantar la risa.' },
  { cat: 'Caos Controlado', q: 'nos salve las papas esta semana si algo se prende fuego',
    tipo: 'Discurso', icon: Flame, award: 'Héroe / Heroína de la Semana',
    consigna: 'Discurso de agradecimiento de 5 segundos aceptando el título de héroe/heroína de la semana.' },
];

export const TOTAL_ROUNDS = QUESTIONS.length;
