export type Milestone = {
  id: string;
  label: string;
  at: number;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  current: number;
  deadline: string; // 'YYYY-MM-DD' or ''
  color: string;
  createdAt: string; // ISO
  milestones: Milestone[];
};

export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string; // ISO
  log: Record<string, boolean>; // 'YYYY-MM-DD' -> done
};

export type Accent = 'ice' | 'aurora' | 'ember';

export type AppData = {
  version: 1;
  userName: string;
  accent: Accent;
  goals: Goal[];
  habits: Habit[];
};
