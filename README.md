# ¿Quién es más probable que…? 🎉

Juego rompehielos multijugador para la weekly del equipo remoto. Una compu entra en **Modo moderación** y comparte su pantalla en la videollamada. Cada jugador entra con el link desde su celular (u otro dispositivo), toca su nombre y vota **una sola vez por ronda**. La persona más votada cumple una consigna.

**Stack:** React 18 · Vite 5 · Tailwind CSS 3 · lucide-react · Firebase (Auth anónima + Realtime Database)

## Cómo se juega

**Un dispositivo = un rol.** Cada navegador tiene un solo rol: un nombre de jugador/a **o** la moderación. Todas las pestañas de ese navegador muestran el mismo rol, y no se pueden tener dos nombres (ni un nombre y la moderación) en el mismo navegador. Para cambiar de rol hay que tocar **Salir** / **No soy yo** en la barra de arriba.

1. **Pantalla inicial:** tiene dos caminos.
   - **¿Quién sos?** Cada jugador/a toca su nombre. Un nombre que ya tomó otro dispositivo aparece bloqueado.
   - **Modo moderación:** se elige en la compu que se va a compartir en la llamada. Si está configurado `VITE_MODERATOR_PIN`, pide el PIN. Solo puede haber una moderación conectada.
2. **La moderación no juega:** no vota y no aparece en la votación ni en los resultados. Si quien modera también quiere jugar, entra con su nombre desde **otro dispositivo**, por ejemplo el celular.
3. **Sala de espera:** la pantalla de moderación muestra el link para entrar, quién está conectado y las reglas. La moderación toca **Comenzar Juego** (hacen falta al menos 2 jugadores). Si alguien entra tarde, se suma solo.
4. **Cada ronda (10 en total):**
   - La moderación lanza **3, 2, 1, ¡YA!**, y la cuenta aparece sincronizada en todas las pantallas.
   - Al “¡YA!” se abre la votación. Cada jugador/a elige a alguien y confirma. El voto no se puede cambiar.
   - Se ve quién ya votó, pero nunca a quién votó cada uno.
   - La moderación toca **Revelar**: todas las pantallas muestran las barras, el ganador (o los empatados) y la consigna.
5. **Premios de la Weekly:** MVP, podio, Ninja del Perfil Bajo y un título honorífico por ronda.

La pantalla de moderación tiene una barra de control abajo con **Reiniciar partida**, disponible en cualquier momento (pide confirmación). Reiniciar borra los votos y vuelve a la sala de espera; los jugadores siguen conectados.

Si la moderación se desconecta, los jugadores ven un aviso y la partida sigue apenas vuelva.

### Probar en local con varios jugadores

Como cada navegador tiene un solo rol, para simular varias personas en una misma compu usá **navegadores distintos** (Chrome, Firefox, Safari…), **ventanas de incógnito** o el **celular** en la misma red (`npm run dev -- --host`). Abrir otra pestaña normal del mismo navegador muestra el mismo rol.

### ¿Cómo se garantiza un voto por persona?

- Cada navegador inicia una sesión anónima de Firebase con un `uid` propio, compartido por todas sus pestañas.
- Al tocar un nombre (o entrar como moderación), ese rol queda asociado a ese `uid` en `presence`. Nadie más puede tomarlo mientras esté conectado.
- Solo la moderación (`presence/moderacion`) puede cambiar el estado del juego o borrar los votos.
- Las **reglas de la base de datos** (`database.rules.json`) solo aceptan un voto en `votes/{ronda}/{nombre}` si:
  - quien escribe es el dueño de ese nombre,
  - esa persona participa de la partida (`game/players`), y
  - todavía no existe un voto de esa persona en esa ronda.

  Esto no depende solo del frontend: la base de datos rechaza un segundo voto.


## Salas

Por defecto todos juegan en la sala `weekly`. Para tener otra partida en paralelo, agregá `?sala=nombre` al link (por ejemplo `https://tu-app.vercel.app/?sala=equipo-b`).

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá los datos de Firebase. `VITE_MODERATOR_PIN` es opcional: si está vacío no se pide PIN. El PIN es una barrera liviana para que nadie entre como moderación por error; viaja en el bundle del frontend, así que no es un secreto.

## Personalizar

| Qué | Dónde |
| --- | --- |
| Participantes y colores | `src/data/people.js` |
| Preguntas, consignas, categorías y títulos | `src/data/questions.js` |
| Lógica en tiempo real (roles, presencia, votos, rondas) | `src/hooks/useGame.js` |
| Reglas de seguridad | `database.rules.json` |

## Estructura

```
src/
├── App.jsx                  # Ruteo según rol: elegir rol → moderación o jugador (sala → ronda → final)
├── lib/
│   ├── firebase.js          # Inicialización con variables de entorno + PIN de moderación
│   └── tally.js             # Conteo de votos y ganadores
├── hooks/
│   ├── useGame.js           # Roles, estado compartido en Firebase y acciones
│   ├── useCountdown.js      # Cuenta regresiva sincronizada 3, 2, 1, ¡YA! + beep
│   └── useBeep.js           # Sonido de la cuenta regresiva
├── data/
│   ├── people.js
│   └── questions.js
└── components/
    ├── IdentifyScreen.jsx   # "¿Quién sos?" + "Modo moderación"
    ├── ModeratorScreen.jsx  # Pantalla para compartir + barra de control
    ├── LobbyScreen.jsx      # Sala de espera del jugador (PlayersGrid, RulesCard)
    ├── RoundScreen.jsx      # Ronda del jugador: votar y ver resultados
    ├── RoundParts.jsx       # RoundHeader, QuestionCard, VoteProgress
    ├── VoteBoard.jsx        # Voto único con confirmación + progreso
    ├── Results.jsx          # Barras, ganador y consigna
    ├── FinalScreen.jsx      # Premios de la Weekly
    ├── CountdownOverlay.jsx
    ├── TopBar.jsx
    ├── HostMissing.jsx
    └── ui.jsx               # Avatar, Card, Confetti, ConfirmDialog
```
