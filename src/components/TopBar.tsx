import { useStore } from '../store';
import { formatDate, todayKey } from '../lib/dates';
import { currentStreak } from '../lib/streaks';
import { computeXP, levelFromXP } from '../lib/xp';
import Ring from './Ring';

export default function TopBar() {
  const { userName, goals, habits } = useStore();
  const today = new Date();
  const doneToday = habits.filter((h) => h.log[todayKey()]).length;
  const dailyPct = habits.length ? doneToday / habits.length : 0;
  const bestStreak = habits.reduce((m, h) => Math.max(m, currentStreak(h.log)), 0);
  const xp = computeXP(goals, habits);
  const { level, into, span } = levelFromXP(xp);

  return (
    <header className="topbar">
      <div>
        <div className="topbar-date">{formatDate(today)}</div>
        <div className="topbar-greet">Systems nominal, {userName}.</div>
      </div>
      <div className="topbar-stats">
        <div className="stat-chip" title="Longest active habit streak">
          <span className="stat-num">{bestStreak}</span>
          <span className="stat-label">STREAK 🔥</span>
        </div>
        <div className="stat-chip" title="Experience and rank">
          <span className="stat-num">LV {level}</span>
          <span className="stat-label">
            {xp} XP · {Math.round((into / span) * 100)}% → LV {level + 1}
          </span>
        </div>
        <Ring pct={dailyPct} size={54} stroke={5}>
          {Math.round(dailyPct * 100)}%
        </Ring>
      </div>
    </header>
  );
}
