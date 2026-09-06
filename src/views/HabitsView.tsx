import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../store';
import { lastNDays, todayKey } from '../lib/dates';
import { currentStreak, longestStreak } from '../lib/streaks';

const ICONS = ['💪', '📖', '🏃', '🧘', '💧', '🥗', '✍️', '🎸', '💊', '🛏️', '🧹', '📵'];
const COLORS = ['#6ee7ff', '#7cffb2', '#a78bfa', '#ffc46b', '#ff7a90'];

export default function HabitsView() {
  const { habits, addHabit, deleteHabit, toggleHabit } = useStore();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const tKey = todayKey();
  const week = lastNDays(7);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({ name: name.trim(), icon, color });
    setName('');
  };

  return (
    <div className="view">
      <div className="view-head">
        <h1>Habit Protocol</h1>
        <p className="view-sub">Small rituals, daily. That's how arcs bend.</p>
      </div>

      <form className="panel form-row" onSubmit={submit}>
        <input
          className="input"
          placeholder="New ritual — e.g. 5km run, read 20 pages"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="icon-row">
          {ICONS.map((i) => (
            <button
              type="button"
              key={i}
              className={`icon-pick${i === icon ? ' sel' : ''}`}
              onClick={() => setIcon(i)}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="swatch-row">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              className={`swatch${c === color ? ' sel' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`color ${c}`}
            />
          ))}
        </div>
        <button className="btn primary" type="submit">
          + Add
        </button>
      </form>

      {habits.length === 0 && <div className="empty">No rituals registered.</div>}

      <div className="habit-list">
        {habits.map((h) => {
          const done = !!h.log[tKey];
          const streak = currentStreak(h.log);
          const best = longestStreak(h.log);
          return (
            <section key={h.id} className="panel habit-row">
              <span className="habit-icon" style={{ color: h.color }}>
                {h.icon}
              </span>
              <div className="habit-meta">
                <div className="habit-name">{h.name}</div>
                <div className="habit-sub">
                  🔥 {streak} active · {best} best
                </div>
              </div>
              <div className="week-dots" title="Last 7 days (oldest → today)">
                {week.map((k) => (
                  <span
                    key={k}
                    className={`dot${h.log[k] ? ' on' : ''}${k === tKey ? ' today' : ''}`}
                    style={
                      h.log[k] ? { background: h.color, borderColor: h.color, boxShadow: `0 0 8px ${h.color}` } : undefined
                    }
                  />
                ))}
              </div>
              <button
                className={`toggle${done ? ' on' : ''}`}
                onClick={() => toggleHabit(h.id)}
                aria-pressed={done}
                title={done ? 'Mark as not done' : 'Complete today'}
              >
                {done ? '✓' : ''}
              </button>
              <button
                className="icon-btn"
                title="Delete habit"
                onClick={() => {
                  if (window.confirm(`Delete ritual "${h.name}" and its history?`)) deleteHabit(h.id);
                }}
              >
                ✕
              </button>
            </section>
          );
        })}
      </div>
    </div>
  );
}
