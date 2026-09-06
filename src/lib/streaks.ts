import { addDays, lastNDays, parseKey, toDateKey, todayKey, DAY_MS } from './dates';

/**
 * Consecutive days ending today (or yesterday if today is not yet done).
 */
export function currentStreak(log: Record<string, boolean>): number {
  if (Object.keys(log).length === 0) return 0;
  let cursor = new Date();
  if (!log[todayKey()]) cursor = addDays(cursor, -1);
  let streak = 0;
  while (log[toDateKey(cursor)]) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Longest run of consecutive completed days, ever. */
export function longestStreak(log: Record<string, boolean>): number {
  const keys = Object.keys(log)
    .filter((k) => log[k])
    .sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of keys) {
    run = prev !== null && parseKey(k).getTime() - parseKey(prev).getTime() === DAY_MS ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

/** Fraction of the last `days` days that were completed (0..1). */
export function completionRate(log: Record<string, boolean>, days: number): number {
  const keys = lastNDays(days);
  return keys.filter((k) => log[k]).length / days;
}
