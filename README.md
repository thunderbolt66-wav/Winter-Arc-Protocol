# ❄ Winter Arc Protocol

A futuristic personal command dashboard that tracks **goals, execution, progress, and daily discipline** through an immersive Arctic-inspired interface.

Built with React 18 + TypeScript + Vite + Zustand. 100% local — no accounts, no cloud. Your data lives in your browser (or the desktop app's storage).

---

## 🎯 Features (Phase 1 — MVP)

- **Mission Board** — daily habit check-ins, live streaks, daily XP, priority-goal rings
- **Goals** — objectives with targets, units, deadlines, and checkpoints; progress rings, ±1 steppers, edit/delete
- **Habits** — ritual CRUD with emoji icons, 7-day dot history, active + best streaks
- **Progress** — 16-week discipline heatmap, 14-day completion bars, all-time stats
- **Settings** — commander name, 3 accent themes (Ice / Aurora / Ember), JSON export/import, full reset
- **Arctic UX** — animated aurora background, canvas snowfall, glassmorphism panels, glow accents, responsive layout

## 🚀 Quick start (development)

```bash
npm install
npm run dev        # → http://localhost:5173
```

## 📦 Run as a single file (no terminal, no install)

```bash
npm run build
```

Then just **double-click `dist/index.html`** — everything (JS + CSS) is inlined into that one self-contained file. Data persists in the browser's localStorage.

## 💻 Run as a desktop .exe (Windows, no terminal)

On a Windows machine:

```bash
npm install
npm run dist:win
```

Produces **`release/WinterArcProtocol-0.1.0.exe`** — a single portable executable. Double-click and done: no installer, no terminal, no Node needed at runtime.

Other platforms: `npm run dist:mac` (dmg) · `npm run dist:linux` (AppImage)

## 🗺 Roadmap

| Phase | Scope                                                                    | Status |
| ----- | ------------------------------------------------------------------------ | ------ |
| 1     | MVP: goals, habits, streaks, heatmap, XP, export/import                  | ✅     |
| 2     | Reminders/notifications, richer analytics, rank titles & cosmetic themes | ⬜     |
| 3     | Desktop extras: tray icon, global hotkeys, native notifications, backup  | ⬜     |
| 4     | Stretch: voice input, multi-device sync                                  | ⬜     |

## 🧠 Data & privacy

All data is stored locally under the `winter-arc-protocol-v1` localStorage key. Export a JSON backup any time from **Settings → Data**. Nothing ever leaves your machine.
