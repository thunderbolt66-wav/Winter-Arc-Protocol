import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Accent, AppData, Goal, Habit } from './types';
import { todayKey } from './lib/dates';
import { uid } from './lib/uid';

type Store = AppData & {
  setUserName: (v: string) => void;
  setAccent: (v: Accent) => void;
  addGoal: (g: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, patch: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void;
  deleteGoal: (id: string) => void;
  bumpGoal: (id: string, delta: number) => void;
  addHabit: (h: Omit<Habit, 'id' | 'createdAt' | 'log'>) => void;
  toggleHabit: (id: string, dateKey?: string) => void;
  deleteHabit: (id: string) => void;
  exportJSON: () => string;
  importJSON: (raw: string) => boolean;
  resetAll: () => void;
};

const blank: AppData = {
  version: 1,
  userName: 'Commander',
  accent: 'ice',
  goals: [],
  habits: [],
};

const pick = (s: Store): AppData => ({
  version: s.version,
  userName: s.userName,
  accent: s.accent,
  goals: s.goals,
  habits: s.habits,
});

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...blank,

      setUserName: (userName) => set({ userName }),
      setAccent: (accent) => set({ accent }),

      addGoal: (g) =>
        set((s) => ({ goals: [...s.goals, { ...g, id: uid(), createdAt: new Date().toISOString() }] })),
      updateGoal: (id, patch) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
      bumpGoal: (id, delta) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, current: Math.max(0, Math.min(g.target, g.current + delta)) } : g
          ),
        })),

      addHabit: (h) =>
        set((s) => ({
          habits: [...s.habits, { ...h, id: uid(), createdAt: new Date().toISOString(), log: {} }],
        })),
      toggleHabit: (id, dateKey = todayKey()) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h;
            const log = { ...h.log };
            if (log[dateKey]) delete log[dateKey];
            else log[dateKey] = true;
            return { ...h, log };
          }),
        })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      exportJSON: () => JSON.stringify(pick(get()), null, 2),
      importJSON: (raw) => {
        try {
          const d = JSON.parse(raw) as Partial<AppData>;
          if (d.version !== 1 || !Array.isArray(d.goals) || !Array.isArray(d.habits)) return false;
          set({
            version: 1,
            userName: typeof d.userName === 'string' && d.userName.trim() ? d.userName : 'Commander',
            accent: d.accent === 'aurora' || d.accent === 'ember' || d.accent === 'ice' ? d.accent : 'ice',
            goals: d.goals as Goal[],
            habits: d.habits as Habit[],
          });
          return true;
        } catch {
          return false;
        }
      },
      resetAll: () => set({ ...blank }),
    }),
    {
      name: 'winter-arc-protocol-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: pick,
    }
  )
);
