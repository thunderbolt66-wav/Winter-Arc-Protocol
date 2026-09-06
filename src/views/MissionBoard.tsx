import { useStore } from '../store';
import { todayKey } from '../lib/dates';
import { currentStreak } from '../lib/streaks';
import Ring from '../components/Ring';

export default function MissionBoard() {
  const { habits, goals, toggleHabit, bumpGoal } = useStore();
  const tKey = todayKey();
  const done = habits.filter((h) => h.log[tKey]).length;
  const topGoals = [...goals]
    .sort((a, b) => b.current / Math.max(1, b.target) - a.current / Math.max(1, a.target))
    .slice(0, 3);

  return (
    <div className="view">
      <div className="view-head">
        <h1>Today's Operations</h1>
        <p className="view-sub">Complete the day's protocol to keep the arc alive.</p>
      </div>

      <div className="board-grid">
        <section className="panel">
          <div className="panel-title">Habit Check-In</div>
          {habits.length === 0 && (
            <div className="empty">No rituals registered yet. Add one from the Habits tab.</div>
          )}
          <ul className="checklist">
            {habits.map((h) => {
              const isDone = !!h.log[tKey];
              const streak = currentStreak(h.log);
              return (
                <li key={h.id} className={`check-row${isDone ? ' done' : ''}`}>
                  <span className="check-icon" style={{ color: h.color }}>
                    {h.icon}
                  </span>
                  <div className="check-meta">
                    <div className="check-name">{h.name}</div>
                    <div className="check-sub">
                      {streak > 0 ? `🔥 ${streak}-day streak` : 'no active streak'}
                    </div>
                  </div>
                  <button
                    className={`toggle${isDone ? ' on' : ''}`}
                    onClick={() => toggleHabit(h.id)}
                    aria-pressed={isDone}
                    title={isDone ? 'Mark as not done' : 'Complete today'}
                  >
                    {isDone ? '✓' : ''}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="side-stack">
          <section className="panel">
            <div className="panel-title">Daily Sync</div>
            <div className="sync-row">
              <Ring pct={habits.length ? done / habits.length : 0} size={84} stroke={7}>
                {done}/{habits.length}
              </Ring>
              <div>
                <div className="sync-done">
                  {done} of {habits.length} protocols complete
                </div>
                <div className="sync-xp">+{done * 10} XP today</div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">Priority Goals</div>
            {topGoals.length === 0 && (
              <div className="empty">No objectives on the board. Set your first one in Goals.</div>
            )}
            <ul className="goal-mini-list">
              {topGoals.map((g) => (
                <li key={g.id} className="goal-mini">
                  <Ring pct={g.current / Math.max(1, g.target)} size={40} stroke={4} color={g.color}>
                    {Math.round((g.current / Math.max(1, g.target)) * 100)}
                  </Ring>
                  <div className="goal-mini-meta">
                    <div className="goal-mini-name">{g.title}</div>
                    <div className="goal-mini-sub">
                      {g.current}/{g.target} {g.unit}
                    </div>
                  </div>
                  <button className="step-btn" onClick={() => bumpGoal(g.id, 1)} title="Log one unit">
                    +1
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
