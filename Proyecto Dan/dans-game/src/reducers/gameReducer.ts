export interface Spark {
  id: number;
  letterIndex: number;
  offset: number;
}

export type Level = 'level1' | 'level2';
export type GameScreen = 'menu' | 'playing' | 'victory';

export interface GameState {
  screen: GameScreen;
  level: Level | null;
  word: string;
  pos: number;
  wrong: boolean;
  wrongIndex: number | null;
  success: boolean;
  poppedIndex: number | null;
  sparks: Spark[];
  currentIndex: number;
  levelWords: string[];
  streak: number;
  bestStreak: number;
  totalWordsToday: number;
  achievements: Set<string>;
  lastWord: string | null;
}

export const initialState: GameState = {
  screen: 'menu',
  level: null,
  word: '',
  pos: 0,
  wrong: false,
  wrongIndex: null,
  success: false,
  poppedIndex: null,
  sparks: [],
  currentIndex: 0,
  levelWords: [],
  streak: 0,
  bestStreak: 0,
  totalWordsToday: 0,
  achievements: new Set(),
  lastWord: null,
};

export type GameAction =
  | { type: 'START_LEVEL'; level: Level; words: string[] }
  | { type: 'KEY_PRESS'; key: string; sparks?: Spark[] }
  | { type: 'CLEAR_POP' }
  | { type: 'CLEAR_WRONG' }
  | { type: 'CLEAR_SPARKS'; ids: number[] }
  | { type: 'NEXT_WORD' }
  | { type: 'GO_MENU' }
  | { type: 'ADD_ACHIEVEMENT'; id: string }
  | { type: 'LOAD_PROGRESS'; data: Partial<GameState> };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_LEVEL': {
      const firstWord = action.words[0] || '';
      return {
        ...initialState,
        screen: 'playing',
        level: action.level,
        levelWords: action.words,
        currentIndex: 0,
        word: firstWord,
        lastWord: firstWord,
        achievements: state.achievements,
        streak: state.streak,
        bestStreak: state.bestStreak,
        totalWordsToday: state.totalWordsToday,
      };
    }
    case 'KEY_PRESS': {
      if (state.success) return state;
      const expected = state.word[state.pos];
      if (!expected) return state;

      if (action.key === expected) {
        const nextPos = state.pos + 1;
        const isComplete = nextPos >= state.word.length;
        const newStreak = isComplete ? state.streak + 1 : state.streak;
        return {
          ...state,
          pos: nextPos,
          wrong: false,
          wrongIndex: null,
          poppedIndex: state.pos,
          sparks: action.sparks ? [...state.sparks, ...action.sparks] : state.sparks,
          success: isComplete,
          streak: newStreak,
          bestStreak: isComplete ? Math.max(state.bestStreak, newStreak) : state.bestStreak,
          totalWordsToday: isComplete ? state.totalWordsToday + 1 : state.totalWordsToday,
        };
      } else {
        return {
          ...state,
          wrong: true,
          wrongIndex: state.pos,
          streak: 0,
        };
      }
    }
    case 'CLEAR_POP':
      return { ...state, poppedIndex: null };
    case 'CLEAR_WRONG':
      return { ...state, wrong: false, wrongIndex: null };
    case 'CLEAR_SPARKS':
      return { ...state, sparks: state.sparks.filter(s => !action.ids.includes(s.id)) };
    case 'NEXT_WORD': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.levelWords.length) {
        return { ...state, screen: 'victory', success: false, poppedIndex: null, sparks: [] };
      }
      const nextWord = state.levelWords[nextIndex];
      return {
        ...state,
        word: nextWord,
        pos: 0,
        wrong: false,
        wrongIndex: null,
        success: false,
        poppedIndex: null,
        sparks: [],
        currentIndex: nextIndex,
        lastWord: nextWord,
      };
    }
    case 'GO_MENU':
      return { ...state, screen: 'menu' };
    case 'ADD_ACHIEVEMENT': {
      const next = new Set(state.achievements);
      next.add(action.id);
      return { ...state, achievements: next };
    }
    case 'LOAD_PROGRESS':
      return { ...state, ...action.data };
    default:
      return state;
  }
}
