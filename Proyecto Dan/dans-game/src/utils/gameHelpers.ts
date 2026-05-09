import { words } from '../data/words';

export type Level = 'level1' | 'level2';

export interface WordEntry {
  word: string;
  img: string;
}

export function getWordsForLevel(level: Level): WordEntry[] {
  return words[level];
}

export function pickRandomWord(level: Level, exclude?: string): WordEntry {
  const list = getWordsForLevel(level);
  let attempts = 0;
  let entry: WordEntry;
  do {
    entry = list[Math.floor(Math.random() * list.length)];
    attempts++;
  } while (exclude && entry.word.toLowerCase() === exclude.toLowerCase() && attempts < 50);
  return entry;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getAllWordEntries(): WordEntry[] {
  return [...words.level1, ...words.level2];
}

export function findWordEntry(word: string): WordEntry | undefined {
  return getAllWordEntries().find(e => e.word.toLowerCase() === word.toLowerCase());
}
