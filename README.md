# ¿Quién es más probable que…? 🎉

Juego rompehielos multijugador para la weekly del equipo remoto. Cada persona entra con el link desde su compu o celular, toca su nombre para confirmar que está y vota desde su dispositivo. Puede votar **una sola vez por ronda**. La persona más votada cumple una consigna.

**Stack:** React 18 · Vite 5 · Tailwind CSS 3 · lucide-react · Firebase (Auth anónima + Realtime Database)

## Cómo se juega

1. **¿Quién sos?** Cada uno toca su nombre. Un nombre que ya tomó otro dispositivo aparece bloqueado.
2. **Sala de espera:** se ve quién confirmó. Una persona toca **Quiero moderar**.
3. **Comenzar Juego:** solo participan quienes confirmaron. Si alguien entra tarde, se suma solo.
4. **Cada ronda (10 en total):**
   - Quien modera lanza **3, 2, 1, ¡YA!**, y la cuenta aparece sincronizada en todas las pantallas.
   - Al “¡YA!” se abre la votación. Cada uno elige a alguien y confirma. El voto no se puede cambiar.
   - Todos ven quién ya votó, pero no a quién votó cada uno.
   - Quien modera toca **Revelar**: todas las pantallas muestran las barras, el ganador (o los empatados) y la consigna.
5. **Premios de la Weekly:** MVP, podio, Ninja del Perfil Bajo y un título honorífico por ronda.

Si quien modera se desconecta, aparece un botón para que otra persona tome la moderación.

### ¿Cómo se garantiza un voto por persona?

- Cada navegador inicia una sesión anónima de Firebase con un `uid` propio.
- Al tocar un nombre, ese nombre queda asociado a ese `uid`. Nadie más puede tomarlo mientras esté conectado.
- Las **reglas de la base de datos** (`database.rules.json`) solo aceptan un voto en `votes/{ronda}/{nombre}` si:
  - quien escribe es el dueño de ese nombre, y
  - todavía no existe un voto de esa persona en esa ronda.

  Esto no depende solo del frontend: la base de datos rechaza un segundo voto.


## Salas

Por defecto todos juegan en la sala `weekly`. Para tener otra partida en paralelo, agregá `?sala=nombre` al link (por ejemplo `https://tu-app.vercel.app/?sala=equipo-b`).

## Personalizar

| Qué | Dónde |
| --- | --- |
| Participantes y colores | `src/data/people.js` |
| Preguntas, consignas, categorías y títulos | `src/data/questions.js` |
| Lógica en tiempo real (presencia, votos, rondas) | `src/hooks/useGame.js` |
| Reglas de seguridad | `database.rules.json` |

## Estructura

```
src/
├── App.jsx                  # Ruteo según estado: identificarse → sala → ronda → final
├── lib/
│   ├── firebase.js          # Inicialización con variables de entorno
│   └── tally.js             # Conteo de votos y ganadores
├── hooks/
│   ├── useGame.js           # Estado compartido en Firebase + acciones
│   └── useBeep.js           # Sonido de la cuenta regresiva
├── data/
│   ├── people.js
│   └── questions.js
└── components/
    ├── IdentifyScreen.jsx   # "¿Quién sos?"
    ├── LobbyScreen.jsx      # Sala de espera, link y moderación
    ├── RoundScreen.jsx      # Pregunta, cuenta sincronizada, revelar
    ├── VoteBoard.jsx        # Voto único con confirmación + progreso
    ├── Results.jsx          # Barras, ganador y consigna
    ├── FinalScreen.jsx      # Premios de la Weekly
    ├── CountdownOverlay.jsx
    ├── TopBar.jsx
    ├── HostMissing.jsx
    └── ui.jsx
```
