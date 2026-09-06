import { useEffect, useState } from 'react';
import { useStore } from './store';
import Sidebar, { type ViewId } from './components/Sidebar';
import TopBar from './components/TopBar';
import Snowfall from './components/Snowfall';
import MissionBoard from './views/MissionBoard';
import GoalsView from './views/GoalsView';
import HabitsView from './views/HabitsView';
import ProgressView from './views/ProgressView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [view, setView] = useState<ViewId>('missions');
  const accent = useStore((s) => s.accent);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  return (
    <div className="app">
      <div className="aurora" aria-hidden="true" />
      <Snowfall />
      <Sidebar view={view} onSelect={setView} />
      <div className="main-col">
        <TopBar />
        <main className="main">
          {view === 'missions' && <MissionBoard />}
          {view === 'goals' && <GoalsView />}
          {view === 'habits' && <HabitsView />}
          {view === 'progress' && <ProgressView />}
          {view === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
