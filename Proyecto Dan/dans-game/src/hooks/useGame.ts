import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { Level } from '../utils/gameHelpers';
import { getWordsForLevel, shuffleArray } from '../utils/gameHelpers';
import { gameReducer, initialState, type GameState, type Spark } from '../reducers/gameReducer';

const STORAGE_KEY = 'dan-game-progress';

function serializeState(state: GameState) {
  return JSON.stringify({
    streak: state.streak,
    bestStreak: state.bestStreak,
    totalWordsToday: state.totalWordsToday,
    achievements: Array.from(state.achievements),
  });
}

function deserializeState(raw: string | null): Partial<GameState> | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return {
      streak: data.streak ?? 0,
      bestStreak: data.bestStreak ?? 0,
      totalWordsToday: data.totalWordsToday ?? 0,
      achievements: new Set(data.achievements ?? []),
    };
  } catch {
    return null;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
    const saved = deserializeState(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...init, ...saved } : init;
  });

  const sparkIdRef = useRef(0);

  // Persistir progreso
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeState(state));
    } catch {
      // ignore
    }
  }, [state]);

  // Efectos de limpieza de UI
  useEffect(() => {
    if (state.poppedIndex !== null) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_POP' }), 240);
      return () => clearTimeout(t);
    }
  }, [state.poppedIndex]);

  useEffect(() => {
    if (state.wrong) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_WRONG' }), 400);
      return () => clearTimeout(t);
    }
  }, [state.wrong]);

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => dispatch({ type: 'NEXT_WORD' }), 2400);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  // Sistema de logros
  useEffect(() => {
    const checks: [number | boolean, string][] = [
      [state.totalWordsToday >= 5, 'novice'],
      [state.totalWordsToday >= 20, 'expert'],
      [state.streak >= 3, 'streak_3'],
      [state.streak >= 5, 'streak_5'],
      [state.streak >= 10, 'streak_10'],
      [state.bestStreak >= 10, 'best_streak_10'],
      [state.totalWordsToday >= 50, 'master'],
    ];
    for (const [condition, id] of checks) {
      if (condition && !state.achievements.has(id)) {
        dispatch({ type: 'ADD_ACHIEVEMENT', id });
      }
    }
  }, [state.totalWordsToday, state.streak, state.bestStreak, state.achievements]);

  const startLevel = useCallback((level: Level) => {
    const entries = getWordsForLevel(level);
    const shuffled = shuffleArray(entries);
    const wordList = shuffled.map(e => e.word.toLowerCase());
    dispatch({ type: 'START_LEVEL', level, words: wordList });
  }, []);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (state.success) return;
      const expected = state.word[state.pos];
      if (!expected) return;

      if (key === expected) {
        const newSparks: Spark[] = Array.from({ length: 4 }, () => ({
          id: sparkIdRef.current++,
          letterIndex: state.pos,
          offset: Math.floor(Math.random() * 44) - 22,
        }));
        dispatch({ type: 'KEY_PRESS', key, sparks: newSparks });
        setTimeout(() => {
          dispatch({ type: 'CLEAR_SPARKS', ids: newSparks.map(s => s.id) });
        }, 660);
      } else {
        dispatch({ type: 'KEY_PRESS', key });
      }
    },
    [state.word, state.pos, state.success],
  );

  const goMenu = useCallback(() => {
    dispatch({ type: 'GO_MENU' });
  }, []);

  return {
    state,
    dispatch,
    startLevel,
    handleKeyPress,
    goMenu,
  };
}
