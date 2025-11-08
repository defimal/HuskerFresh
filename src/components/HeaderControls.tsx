import { useSettings } from '../stores/settings';
import { DemoBadge } from './DemoBadge';
import { PWAInstallChip } from './PWAInstallChip';

export function HeaderControls() {
  const { textSize, setTextSize, demoMode, toggleDemoMode } = useSettings();
  return (
    <div className="flex flex-wrap gap-3 items-center text-sm">
      <div className="flex items-center gap-1 rounded-full border border-husker/30 px-3 py-1" role="group" aria-label="Text size">
        <button
          type="button"
          className={`px-2 py-1 rounded-full ${textSize === 'base' ? 'bg-banana text-slate-900' : ''}`}
          onClick={() => setTextSize('base')}
          aria-pressed={textSize === 'base'}
        >
          A
        </button>
        <button
          type="button"
          className={`px-2 py-1 rounded-full ${textSize === 'lg' ? 'bg-banana text-slate-900' : ''}`}
          onClick={() => setTextSize('lg')}
          aria-pressed={textSize === 'lg'}
        >
          A+
        </button>
      </div>
      <button type="button" className={`chip ${demoMode ? 'bg-husker text-white' : ''}`} role="switch" aria-checked={demoMode} onClick={toggleDemoMode}>
        Demo Mode
        <DemoBadge />
      </button>
      <PWAInstallChip />
    </div>
  );
}
