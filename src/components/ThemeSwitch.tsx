import { useTheme, type ThemeMode } from '../contexts/ThemeContext';
import './ThemeSwitch.css';

export default function ThemeSwitch() {
  const { mode, setMode } = useTheme();

  const modes: { key: ThemeMode; label: string }[] = [
    { key: 'light', label: '☀' },
    { key: 'auto', label: '⏱' },
    { key: 'dark', label: '☾' },
  ];

  return (
    <div className="theme-switch" role="radiogroup" aria-label="Theme mode">
      {modes.map(({ key, label }) => (
        <button
          key={key}
          className={`theme-opt ${mode === key ? 'active' : ''}`}
          onClick={() => setMode(key)}
          aria-checked={mode === key}
          role="radio"
          title={key === 'auto' ? 'Auto (6:00-18:00 light)' : key}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
