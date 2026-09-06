import type { Goal, Habit } from '../types';

/**
 * Deterministic XP derived from data (no drift, no writes):
 *  - 10 XP per habit check-in
 *  - 2 XP per percent of a goal completed
 *  - 25 XP per reached checkpoint
 */
export function computeXP(goals: Goal[], habits: Habit[]): number {
  let xp = 0;
  for (const h of habits) xp += Object.values(h.log).filter(Boolean).length * 10;
  for (const g of goals) {
    xp += Math.round((g.current / Math.max(1, g.target)) * 100) * 2;
    xp += g.milestones.filter((m) => g.current >= m.at).length * 25;
  }
  return xp;
}

export function levelFromXP(xp: number): { level: number; into: number; span: number } {
  const level = Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
  const base = 100 * (level - 1) ** 2;
  const next = 100 * level ** 2;
  return { level, into: Math.max(0, xp) - base, span: next - base };
}
