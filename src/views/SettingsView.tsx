import { useRef, useState } from 'react';
import { useStore } from '../store';
import type { Accent } from '../types';

const ACCENTS: { id: Accent; label: string; color: string }[] = [
  { id: 'ice', label: 'Ice', color: '#6ee7ff' },
  { id: 'aurora', label: 'Aurora', color: '#7cffb2' },
  { id: 'ember', label: 'Ember', color: '#ffc46b' },
];

export default function SettingsView() {
  const s = useStore();
  const [status, setStatus] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const blob = new Blob([s.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winter-arc-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus('✓ Backup exported to your downloads.');
  };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setStatus(
        s.importJSON(String(reader.result))
          ? '✓ Backup restored. All systems re-armed.'
          : '✕ Import failed — not a valid Winter Arc backup.'
      );
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (window.confirm('Purge ALL Winter Arc data? This cannot be undone.')) {
      s.resetAll();
      setStatus('✓ All data purged. Fresh arc initiated.');
    }
  };

  return (
    <div className="view">
      <div className="view-head">
        <h1>Settings</h1>
        <p className="view-sub">Configure the protocol. Data never leaves this machine.</p>
      </div>

      <div className="settings-stack">
        <section className="panel">
          <div className="panel-title">Commander</div>
          <div className="set-row">
            <div>
              <div className="set-label">Designation</div>
              <div className="set-sub">Shown in your daily briefing.</div>
            </div>
            <input
              className="input set-input"
              value={s.userName}
              onChange={(e) => s.setUserName(e.target.value)}
            />
          </div>
          <div className="set-row">
            <div>
              <div className="set-label">Aurora Accent</div>
              <div className="set-sub">Tints the interface glow.</div>
            </div>
            <div className="swatch-row">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`swatch${s.accent === a.id ? ' sel' : ''}`}
                  style={{ background: a.color }}
                  title={a.label}
                  onClick={() => s.setAccent(a.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">Data</div>
          <div className="set-row">
            <div>
              <div className="set-label">Export backup</div>
              <div className="set-sub">Download everything as JSON.</div>
            </div>
            <button className="btn" onClick={exportData}>
              ⬇ Export
            </button>
          </div>
          <div className="set-row">
            <div>
              <div className="set-label">Restore backup</div>
              <div className="set-sub">Loads a Winter Arc JSON file (replaces current data).</div>
            </div>
            <button className="btn" onClick={() => fileRef.current?.click()}>
              ⬆ Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImportFile(f);
                e.target.value = '';
              }}
            />
          </div>
          <div className="status-line">{status}</div>
        </section>

        <section className="panel">
          <div className="panel-title">Danger Zone</div>
          <div className="set-row">
            <div>
              <div className="set-label danger-text">Purge all data</div>
              <div className="set-sub">Deletes every goal, habit, and streak record.</div>
            </div>
            <button className="btn danger" onClick={reset}>
              ✕ Reset
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">About</div>
          <div className="about-text">
            Winter Arc Protocol v0.1.0 — Phase 1 (MVP)
            <br />
            Stack: React · TypeScript · Vite · Zustand · Electron (optional desktop shell)
            <br />
            Storage: 100% local (browser localStorage). No accounts, no cloud.
          </div>
        </section>
      </div>
    </div>
  );
}
