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
import { PEOPLE } from '../data/people';
import { TOTAL_ROUNDS } from '../data/questions';

export const HOST_KEY = 'moderacion';

const sanitizeRoom = (s) => (s || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
export const ROOM = sanitizeRoom(new URLSearchParams(window.location.search).get('sala')) || 'weekly';
const BASE = `rooms/${ROOM}`;
const ROLE_KEY = `qemp:role:${ROOM}`;

const ORDER = PEOPLE.map((p) => p.name);
const inOrder = (names) => ORDER.filter((n) => names.includes(n));
const validRole = (k) => (k === HOST_KEY || ORDER.includes(k) ? k : null);

const storage = {
  get: () => {
    try { return validRole(localStorage.getItem(ROLE_KEY)); } catch { return null; }
  },
  set: (v) => {
    try { localStorage.setItem(ROLE_KEY, v); } catch {}
  },
  clear: () => {
    try { localStorage.removeItem(ROLE_KEY); } catch {}
  },
};

export function useGame() {
  const [uid, setUid] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [offset, setOffset] = useState(0);
  const [presence, setPresence] = useState({});
  const [game, setGame] = useState(null);
  const [votes, setVotes] = useState({});
  const [loaded, setLoaded] = useState({ presence: false, game: false });
  const [storedRole, setStoredRole] = useState(storage.get);

  const presenceRef = useRef(presence);
  const gameRef = useRef(game);
  const offsetRef = useRef(offset);
  const claimingRef = useRef(false);
  presenceRef.current = presence;
  gameRef.current = game;
  offsetRef.current = offset;

  const saveRole = useCallback((k) => {
    storage.set(k);
    setStoredRole(k);
  }, []);
  const clearRole = useCallback(() => {
    storage.clear();
    setStoredRole(null);
  }, []);

  // Las demás pestañas del navegador se enteran cuando se elige o se libera un rol.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ROLE_KEY || e.key === null) setStoredRole(storage.get());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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

  const myKey = useMemo(
    () => Object.keys(presence).find((k) => validRole(k) && presence[k]?.uid === uid) || null,
    [presence, uid]
  );
  const isHost = myKey === HOST_KEY;
  const myName = myKey && !isHost ? myKey : null;
  const hostOnline = Boolean(presence[HOST_KEY]);
  const onlineNames = useMemo(() => inOrder(Object.keys(presence)), [presence]);
  const candidates = useMemo(() => inOrder(Object.keys(game?.players || {})), [game]);

  const serverNow = useCallback(() => Date.now() + offsetRef.current, []);

  const claim = useCallback(
    async (key) => {
      if (!uid || !validRole(key) || claimingRef.current) return false;
      const current = Object.keys(presenceRef.current).find((k) => validRole(k) && presenceRef.current[k]?.uid === uid);
      const stored = storage.get();
      if ((current && current !== key) || (stored && stored !== key)) return false;

      claimingRef.current = true;
      try {
        const r = ref(db, `${BASE}/presence/${key}`);
        const res = await runTransaction(r, (cur) => {
          if (cur && cur.uid !== uid) return undefined;
          return { uid, at: Date.now() };
        });
        if (!res.committed) {
          if (stored === key) clearRole();
          return false;
        }

        await onDisconnect(r).remove();
        saveRole(key);

        if (key === HOST_KEY) {
          await runTransaction(ref(db, `${BASE}/game`), (cur) => {
            if (!cur) return { status: 'lobby', host: HOST_KEY };
            if (cur.host === HOST_KEY) return undefined;
            return { ...cur, host: HOST_KEY };
          });
        } else {
          const st = gameRef.current?.status;
          if (st === 'playing' || st === 'final') {
            await set(ref(db, `${BASE}/game/players/${key}`), true);
          }
        }
        return true;
      } catch (e) {
        console.error('No se pudo tomar el rol', e);
        if (stored === key) clearRole();
        return false;
      } finally {
        claimingRef.current = false;
      }
    },
    [uid, saveRole, clearRole]
  );

  // Si otra pestaña de este navegador se cerró y su onDisconnect borró la presencia,
  // esta pestaña vuelve a reclamar el rol guardado.
  const takenElsewhere = Boolean(storedRole && presence[storedRole] && presence[storedRole].uid !== uid);
  useEffect(() => {
    if (!uid || !connected || !loaded.presence || !loaded.game || myKey || !storedRole) return;
    if (takenElsewhere) {
      clearRole();
      return;
    }
    claim(storedRole);
  }, [uid, connected, loaded.presence, loaded.game, myKey, storedRole, takenElsewhere, claim, clearRole]);

  const release = useCallback(async () => {
    if (!myKey) return;
    clearRole();
    const r = ref(db, `${BASE}/presence/${myKey}`);
    await onDisconnect(r).cancel();
    await remove(r);
  }, [myKey, clearRole]);

  const startGame = useCallback(async () => {
    if (!isHost) return;
    const players = Object.fromEntries(inOrder(Object.keys(presenceRef.current)).map((n) => [n, true]));
    await update(ref(db, BASE), {
      votes: null,
      game: { status: 'playing', host: HOST_KEY, round: 0, phase: 'waiting', countdownAt: null, players },
    });
  }, [isHost]);

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
    await update(ref(db, BASE), { votes: null, game: { status: 'lobby', host: HOST_KEY } });
  }, [isHost]);

  return {
    ready: Boolean(uid && loaded.presence && loaded.game),
    restoring: Boolean(!myKey && storedRole && !takenElsewhere),
    authError,
    connected,
    presence,
    game,
    votes,
    myKey,
    myName,
    isHost,
    hostOnline,
    onlineNames,
    candidates,
    serverNow,
    claim,
    release,
    startGame,
    startCountdown,
    vote,
    reveal,
    nextRound,
    resetGame,
  };
}
