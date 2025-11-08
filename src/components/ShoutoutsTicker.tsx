import { useState } from 'react';
import { useCommunity } from '../stores/community';

export function ShoutoutsTicker() {
  const { shoutouts } = useCommunity();
  const looped = shoutouts.length ? [...shoutouts, ...shoutouts] : shoutouts;
  const [paused, setPaused] = useState(false);

  return (
    <section className="mt-10" aria-label="Anonymous shout-outs">
      <div className="bg-white/80 dark:bg-huskerDark/80 rounded-3xl p-4 border border-white/40 overflow-hidden">
        <p className="text-sm uppercase tracking-[0.3em] text-husker dark:text-banana">Anonymous shout-outs</p>
        <div
          className="mt-2 overflow-hidden"
          role="status"
          aria-live="polite"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="ticker-track flex gap-4" tabIndex={0} style={{ animationPlayState: paused ? 'paused' : 'running' }}>
            {looped.map((item, index) => (
              <span key={`${item}-${index}`} className="font-semibold whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
