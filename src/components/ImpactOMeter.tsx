import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { statTemplates, useImpact, useImpactTicker } from '../stores/impact';
import '../styles.css';

function formatWait(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
}

export function ImpactOMeter() {
  const { state } = useImpact();
  useImpactTicker();

  const stat = statTemplates[state.currentIndex];
  const value =
    stat.key === 'avgWaitSeconds'
      ? formatWait(state.avgWaitSeconds)
      : state[stat.key].toLocaleString();

  return (
    <div className={`bg-white/90 dark:bg-midnight/70 rounded-2xl p-5 shadow-lg border border-white/30 ${state.highlight ? 'ring-4 ring-banana/70' : ''}`}>
      <p className="text-xs uppercase tracking-[0.4em] text-husker dark:text-banana">Impact O-Meter</p>
      <div className="relative h-16 mt-2" aria-live="polite">
        <SwitchTransition mode="out-in">
          <CSSTransition key={stat.key} classNames="stat-fade" timeout={300}>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
              <p className="text-3xl font-black">{value}</p>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
}
