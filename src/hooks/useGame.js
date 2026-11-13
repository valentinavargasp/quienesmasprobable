import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  onDisconnect,
  onValue,
  ref,
  remove,
  runTransaction,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { auth, db } from '../lib/firebase';
import { DEFAULT_HOST, PEOPLE } from '../data/people';
import { TOTAL_ROUNDS } from '../data/questions';

const NAME_KEY = 'qemp:name';

const sanitizeRoom = (s) => (s || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
export const ROOM = sanitizeRoom(new URLSearchParams(window.location.search).get('sala')) || 'weekly';
const BASE = `rooms/${ROOM}`;

const storage = {
  get: () => {
    try { return localStorage.getItem(NAME_KEY); } catch { return null; }
  },
  set: (v) => {
    try { localStorage.setItem(NAME_KEY, v); } catch {}
  },
  clear: () => {
    try { localStorage.removeItem(NAME_KEY); } catch {}
  },
};

const ORDER = PEOPLE.map((p) => p.name);
const inOrder = (names) => ORDER.filter((n) => names.includes(n));

export function useGame() {
  const [uid, setUid] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [offset, setOffset] = useState(0);
  const [presence, setPresence] = useState({});
  const [game, setGame] = useState(null);
  const [votes, setVotes] = useState({});
  const [loaded, setLoaded] = useState({ presence: false, game: false });

  const presenceRef = useRef(presence);
  const gameRef = useRef(game);
  const offsetRef = useRef(offset);
  const claimingRef = useRef(false);
  const autoHostRef = useRef(false);
  presenceRef.current = presence;
  gameRef.current = game;
  offsetRef.current = offset;

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) setUid(user.uid);
        else signInAnonymously(auth).catch((e) => setAuthError(e.code || e.message));
      }),
    []
  );

  useEffect(() => {
    if (!uid) return undefined;
    const unsubs = [
      onValue(ref(db, '.info/connected'), (s) => setConnected(Boolean(s.val()))),
      onValue(ref(db, '.info/serverTimeOffset'), (s) => setOffset(s.val() || 0)),
      onValue(ref(db, `${BASE}/presence`), (s) => {
        setPresence(s.val() || {});
        setLoaded((l) => ({ ...l, presence: true }));
      }),
      onValue(ref(db, `${BASE}/game`), (s) => {
        setGame(s.val());
        setLoaded((l) => ({ ...l, game: true }));
      }),
      onValue(ref(db, `${BASE}/votes`), (s) => setVotes(s.val() || {})),
    ];
    return () => unsubs.forEach((u) => u());
  }, [uid]);

  const myName = useMemo(
    () => Object.keys(presence).find((n) => presence[n]?.uid === uid) || null,
    [presence, uid]
  );
  const onlineNames = useMemo(() => inOrder(Object.keys(presence)), [presence]);
  const candidates = useMemo(() => inOrder(Object.keys(game?.players || {})), [game]);
  const isHost = Boolean(myName && game?.host === myName);
  const hostOnline = Boolean(game?.host && presence[game.host]);

  const serverNow = useCallback(() => Date.now() + offsetRef.current, []);

  const claim = useCallback(
    async (name) => {
      if (!uid || claimingRef.current) return false;
      claimingRef.current = true;
      try {
        const r = ref(db, `${BASE}/presence/${name}`);
        const res = await runTransaction(r, (cur) => {
          if (cur && cur.uid !== uid) return undefined;
          return { uid, at: Date.now() };
        });
        if (!res.committed) return false;

        await onDisconnect(r).remove();
        storage.set(name);

        await Promise.all(
          Object.keys(presenceRef.current)
            .filter((n) => n !== name && presenceRef.current[n]?.uid === uid)
            .map((n) => remove(ref(db, `${BASE}/presence/${n}`)))
        );

        const st = gameRef.current?.status;
        if (st === 'playing' || st === 'final') {
          await set(ref(db, `${BASE}/game/players/${name}`), true);
        }
        return true;
      } catch (e) {
        console.error('No se pudo tomar el nombre', e);
        return false;
      } finally {
        claimingRef.current = false;
      }
    },
    [uid]
  );

  useEffect(() => {
    if (!uid || !connected || !loaded.presence || myName) return;
    const stored = storage.get();
    if (!stored || !ORDER.includes(stored)) return;
    if (presence[stored] && presence[stored].uid !== uid) {
      storage.clear();
      return;
    }
    claim(stored);
  }, [uid, connected, loaded.presence, myName, presence, claim]);

  const release = useCallback(async () => {
    if (!myName) return;
    storage.clear();
    const r = ref(db, `${BASE}/presence/${myName}`);
    await onDisconnect(r).cancel();
    if (gameRef.current?.host === myName) await set(ref(db, `${BASE}/game/host`), null);
    await remove(r);
  }, [myName]);

  const becomeHost = useCallback(async () => {
    if (!myName) return;
    if (!gameRef.current) await set(ref(db, `${BASE}/game`), { status: 'lobby', host: myName });
    else await set(ref(db, `${BASE}/game/host`), myName);
  }, [myName]);

  useEffect(() => {
    if (myName !== DEFAULT_HOST || !connected || !loaded.game || hostOnline || autoHostRef.current) return;
    autoHostRef.current = true;
    runTransaction(ref(db, `${BASE}/game`), (cur) => {
      if (!cur) return { status: 'lobby', host: DEFAULT_HOST };
      if (cur.host && cur.host !== DEFAULT_HOST && presenceRef.current[cur.host]) return undefined;
      return { ...cur, host: DEFAULT_HOST };
    })
      .catch((e) => console.error('No se pudo asignar la moderación', e))
      .finally(() => {
        autoHostRef.current = false;
      });
  }, [myName, connected, loaded.game, hostOnline]);

  const startGame = useCallback(async () => {
    if (!isHost) return;
    const players = Object.fromEntries(Object.keys(presenceRef.current).map((n) => [n, true]));
    await update(ref(db, BASE), {
      votes: null,
      game: { status: 'playing', host: myName, round: 0, phase: 'waiting', countdownAt: null, players },
    });
  }, [isHost, myName]);

  const startCountdown = useCallback(async () => {
    if (!isHost) return;
    await update(ref(db, `${BASE}/game`), { phase: 'voting', countdownAt: serverTimestamp() });
  }, [isHost]);

  const vote = useCallback(
    async (target) => {
      const g = gameRef.current;
      if (!myName || !g) return false;
      try {
        await set(ref(db, `${BASE}/votes/${g.round}/${myName}`), target);
        return true;
      } catch (e) {
        console.error('Voto rechazado', e);
        return false;
      }
    },
    [myName]
  );

  const reveal = useCallback(async () => {
    if (!isHost) return;
    await update(ref(db, `${BASE}/game`), { phase: 'revealed' });
  }, [isHost]);

  const nextRound = useCallback(async () => {
    const g = gameRef.current;
    if (!isHost || !g) return;
    if (g.round >= TOTAL_ROUNDS - 1) {
      await update(ref(db, `${BASE}/game`), { status: 'final' });
    } else {
      await update(ref(db, `${BASE}/game`), { round: g.round + 1, phase: 'waiting', countdownAt: null });
    }
  }, [isHost]);

  const resetGame = useCallback(async () => {
    if (!isHost) return;
    await update(ref(db, BASE), { votes: null, game: { status: 'lobby', host: myName } });
  }, [isHost, myName]);

  return {
    ready: Boolean(uid && loaded.presence && loaded.game),
    authError,
    connected,
    presence,
    game,
    votes,
    myName,
    isHost,
    hostOnline,
    onlineNames,
    candidates,
    serverNow,
    claim,
    release,
    becomeHost,
    startGame,
    startCountdown,
    vote,
    reveal,
    nextRound,
    resetGame,
  };
}
