import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../store';
import type { Goal } from '../types';
import { uid } from '../lib/uid';
import { DAY_MS } from '../lib/dates';
import Ring from '../components/Ring';

const COLORS = ['#6ee7ff', '#7cffb2', '#a78bfa', '#ffc46b', '#ff7a90'];

type FormState = {
  title: string;
  unit: string;
  target: string;
  current: string;
  deadline: string;
  color: string;
  milestones: { label: string; at: string }[];
};

const emptyForm: FormState = {
  title: '',
  unit: '',
  target: '30',
  current: '0',
  deadline: '',
  color: COLORS[0],
  milestones: [],
};

export default function GoalsView() {
  const { goals, addGoal, updateGoal, deleteGoal, bumpGoal } = useStore();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const startEdit = (g: Goal) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      unit: g.unit,
      target: String(g.target),
      current: String(g.current),
      deadline: g.deadline,
      color: g.color,
      milestones: g.milestones.map((m) => ({ label: m.label, at: String(m.at) })),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const target = Number(form.target);
    const current = Number(form.current || '0');
    if (!form.title.trim() || !Number.isFinite(target) || target <= 0) return;
    const payload = {
      title: form.title.trim(),
      description: '',
      unit: form.unit.trim() || 'units',
      target,
      current: Math.max(0, Math.min(target, Number.isFinite(current) ? current : 0)),
      deadline: form.deadline,
      color: form.color,
      milestones: form.milestones
        .map((m) => ({ label: m.label.trim() || `Checkpoint ${m.at}`, at: Number(m.at) }))
        .filter((m) => Number.isFinite(m.at) && m.at > 0 && m.at <= target)
        .sort((a, b) => a.at - b.at)
        .map((m) => ({ id: uid(), ...m })),
    };
    if (editingId) updateGoal(editingId, payload);
    else addGoal(payload);
    cancelEdit();
  };

  return (
    <div className="view">
      <div className="view-head">
        <h1>Goals</h1>
        <p className="view-sub">Define the arc. Track every unit of progress.</p>
      </div>

      <form className="panel" onSubmit={submit}>
        <div className="panel-title">{editingId ? 'Edit Goal' : 'New Goal'}</div>
        <div className="form-grid">
          <input
            className="input"
            placeholder="Objective — e.g. Read 12 books"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
          <input
            className="input"
            placeholder="Unit — books, km, hrs…"
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="1"
            title="Target"
            placeholder="Target"
            value={form.target}
            onChange={(e) => set('target', e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            title="Current"
            placeholder="Current"
            value={form.current}
            onChange={(e) => set('current', e.target.value)}
          />
          <input
            className="input"
            type="date"
            title="Deadline"
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
          />
          <div className="swatch-row">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={`swatch${form.color === c ? ' sel' : ''}`}
                style={{ background: c }}
                onClick={() => set('color', c)}
                aria-label={`color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="ms-block">
          <div className="form-label">Checkpoints (optional)</div>
          {form.milestones.map((m, i) => (
            <div className="ms-row" key={i}>
              <input
                className="input ms-at-input"
                type="number"
                min="1"
                placeholder="at"
                value={m.at}
                onChange={(e) => {
                  const ms = [...form.milestones];
                  ms[i] = { ...m, at: e.target.value };
                  set('milestones', ms);
                }}
              />
              <input
                className="input"
                placeholder="Label — e.g. First quarter"
                value={m.label}
                onChange={(e) => {
                  const ms = [...form.milestones];
                  ms[i] = { ...m, label: e.target.value };
                  set('milestones', ms);
                }}
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => set('milestones', form.milestones.filter((_, j) => j !== i))}
                title="Remove checkpoint"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn"
            onClick={() => set('milestones', [...form.milestones, { label: '', at: '' }])}
          >
            + Checkpoint
          </button>
        </div>

        <div className="form-actions">
          <button className="btn primary" type="submit">
            {editingId ? '✓ Save Changes' : '+ Add Goal'}
          </button>
          {editingId && (
            <button className="btn" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {goals.length === 0 && !editingId && (
        <div className="empty">No objectives on the board. Define your first goal above.</div>
      )}

      <div className="goal-grid">
        {goals.map((g) => {
          const pct = g.current / Math.max(1, g.target);
          const daysLeft = g.deadline
            ? Math.ceil((new Date(g.deadline + 'T00:00:00').getTime() - Date.now()) / DAY_MS)
            : null;
          return (
            <article key={g.id} className="panel goal-card">
              <div className="goal-head">
                <Ring pct={pct} size={64} stroke={6} color={g.color}>
                  {Math.round(pct * 100)}%
                </Ring>
                <div className="goal-head-meta">
                  <h3>{g.title}</h3>
                  <div className="goal-progress">
                    {g.current} / {g.target} {g.unit}
                  </div>
                  {daysLeft !== null && (
                    <span className={`chip${daysLeft < 0 ? ' bad' : daysLeft <= 7 ? ' warn' : ''}`}>
                      {daysLeft < 0
                        ? `${-daysLeft}d overdue`
                        : daysLeft === 0
                          ? 'due today'
                          : `${daysLeft}d left`}
                    </span>
                  )}
                </div>
                <button
                  className="icon-btn"
                  title="Delete goal"
                  onClick={() => {
                    if (window.confirm(`Abandon goal "${g.title}"?`)) deleteGoal(g.id);
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="goal-steps">
                <button className="step-btn" onClick={() => bumpGoal(g.id, -1)} title="Undo one unit">
                  −1
                </button>
                <button className="step-btn primary" onClick={() => bumpGoal(g.id, 1)} title="Log one unit">
                  +1 {g.unit}
                </button>
                <button className="icon-btn" title="Edit goal" onClick={() => startEdit(g)}>
                  ✎
                </button>
              </div>
              {g.milestones.length > 0 && (
                <ul className="milestones">
                  {g.milestones.map((m) => (
                    <li key={m.id} className={g.current >= m.at ? 'reached' : ''}>
                      <span className="ms-dot" /> {m.label} <span className="ms-at">· {m.at} {g.unit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
