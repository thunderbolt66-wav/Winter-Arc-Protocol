export type ViewId = 'missions' | 'goals' | 'habits' | 'progress' | 'settings';

const ITEMS: { id: ViewId; icon: string; label: string }[] = [
  { id: 'missions', icon: '🎯', label: 'Mission Board' },
  { id: 'goals', icon: '🏔️', label: 'Goals' },
  { id: 'habits', icon: '🧊', label: 'Habits' },
  { id: 'progress', icon: '📈', label: 'Progress' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

type Props = {
  view: ViewId;
  onSelect: (v: ViewId) => void;
};

export default function Sidebar({ view, onSelect }: Props) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-mark">❄</span>
        <div>
          <div className="logo-title">WINTER ARC</div>
          <div className="logo-sub">PROTOCOL v0.1</div>
        </div>
      </div>
      <nav>
        {ITEMS.map((it) => (
          <button
            key={it.id}
            className={`nav-item${view === it.id ? ' active' : ''}`}
            onClick={() => onSelect(it.id)}
          >
            <span className="nav-icon">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="foot-line" />
        <span>ARCTIC OPS · ONLINE</span>
      </div>
    </aside>
  );
}
