import { useStore } from '../store';
import { addDays, lastNDays, toDateKey } from '../lib/dates';
import { completionRate, longestStreak } from '../lib/streaks';
import Ring from '../components/Ring';

const WEEKS = 16;

export default function ProgressView() {
  const { habits, goals } = useStore();

  const totalCheckIns = habits.reduce(
    (n, h) => n + Object.values(h.log).filter(Boolean).length,
    0
  );
  const bestStreak = habits.reduce((m, h) => Math.max(m, longestStreak(h.log)), 0);
  const consistency = habits.length
    ? habits.reduce((sum, h) => sum + completionRate(h.log, 7), 0) / habits.length
    : 0;
  const doneGoals = goals.filter((g) => g.current >= g.target).length;

  // Heatmap: 16 week-columns ending this week (last column is today's week so far), Sun..Sat rows.
  const today = new Date();
  const start = addDays(today, -(today.getDay() + (WEEKS - 1) * 7));
  const cells: { key: string; count: number }[] = [];
  for (let d = new Date(start); d <= today; d = addDays(d, 1)) {
    const key = toDateKey(d);
    cells.push({ key, count: habits.filter((h) => h.log[key]).length });
  }
  const cols: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));

  const bars = lastNDays(14).map((k) => ({ k, count: habits.filter((h) => h.log[k]).length }));
  const maxBar = Math.max(1, ...bars.map((b) => b.count));

  const levelStyle = (lvl: number) =>
    lvl > 0
      ? {
          background: `color-mix(in srgb, var(--accent) ${12 + lvl * 22}%, rgba(255,255,255,0.04))`,
          borderColor: 'transparent',
        }
      : undefined;

  return (
    <div className="view">
      <div className="view-head">
        <h1>Progress Analytics</h1>
        <p className="view-sub">The data behind the discipline.</p>
      </div>

      <div className="stat-grid">
        <div className="panel stat-card">
          <span className="stat-value">{totalCheckIns}</span>
          <span className="stat-key">Total Check-Ins</span>
        </div>
        <div className="panel stat-card">
          <span className="stat-value">🔥 {bestStreak}</span>
          <span className="stat-key">Best Streak</span>
        </div>
        <div className="panel stat-card">
          <span className="stat-value">{Math.round(consistency * 100)}%</span>
          <span className="stat-key">7-Day Consistency</span>
        </div>
        <div className="panel stat-card">
          <span className="stat-value">
            {doneGoals}/{goals.length}
          </span>
          <span className="stat-key">Goals Completed</span>
        </div>
      </div>

      <section className="panel">
        <div className="panel-title">{WEEKS}-Week Discipline Map</div>
        {habits.length === 0 ? (
          <div className="empty">Add habits to start mapping your discipline.</div>
        ) : (
          <>
            <div className="heatmap-wrap">
              <div className="heatmap">
                {cols.map((col, ci) => (
                  <div className="hm-col" key={ci}>
                    {col.map((cell) => {
                      const lvl = Math.ceil((cell.count / habits.length) * 4);
                      return (
                        <span
                          key={cell.key}
                          className="hm-cell"
                          style={levelStyle(lvl)}
                          title={`${cell.key} · ${cell.count}/${habits.length}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="hm-legend">
              Less
              {[0, 1, 2, 3, 4].map((l) => (
                <span key={l} className="hm-cell" style={levelStyle(l)} />
              ))}
              More
            </div>
          </>
        )}
      </section>

      <div className="progress-grid">
        <section className="panel">
          <div className="panel-title">Last 14 Days</div>
          {habits.length === 0 ? (
            <div className="empty">No data yet.</div>
          ) : (
            <div className="bars">
              {bars.map((b) => (
                <div className="bar-col" key={b.k}>
                  <div
                    className="bar"
                    style={{ height: `${(b.count / maxBar) * 100}%` }}
                    title={`${b.k} · ${b.count} completed`}
                  />
                  <span className="bar-x">{b.k.slice(8)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-title">Goal Status</div>
          {goals.length === 0 ? (
            <div className="empty">No goals registered.</div>
          ) : (
            <ul className="goal-mini-list">
              {goals.slice(0, 6).map((g) => (
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
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
