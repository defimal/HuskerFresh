import { useEffect, useRef } from 'react';
import { usePeelGesture } from '../hooks/usePeelGesture';
import { useConfetti } from '../hooks/useConfetti';

interface HeroPeelCTAProps {
  onPrimeChange?: (prime: () => void) => void;
  focusTargetId?: string;
}

export function HeroPeelCTA({ onPrimeChange, focusTargetId = 'give-swipe-card' }: HeroPeelCTAProps) {
  const statusRef = useRef<HTMLSpanElement>(null);
  const celebrate = useConfetti();

  const announce = (message: string) => {
    if (statusRef.current) statusRef.current.textContent = message;
  };

  const {
    progress,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handleKeyboardActivate,
    prime
  } = usePeelGesture({
    onComplete: () => {
      celebrate({ particleCount: 120, spread: 80 });
      document.getElementById(focusTargetId)?.focus();
    },
    announce
  });

  useEffect(() => {
    if (onPrimeChange) onPrimeChange(prime);
    return () => {
      if (onPrimeChange) onPrimeChange(() => {});
    };
  }, [onPrimeChange, prime]);

  return (
    <div className="space-y-6">
      <div className="sr-only" aria-live="polite" ref={statusRef}>
        Sticker ready
      </div>
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-husker">Peel &amp; Feed</p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Huskers vs. Hunger</h1>
        <p className="text-lg text-slate-600 dark:text-slate-200">
          Gift unused swipes or get a meal discreetly in under a minute.
        </p>
      </div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Peel to donate or request"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleKeyboardActivate();
          }
        }}
        className="relative w-full max-w-md h-32 bg-banana text-slate-900 rounded-2xl shadow-peel overflow-hidden cursor-pointer select-none"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-semibold text-xl">Peel to Donate</p>
          <p className="text-sm text-slate-800">or Request a meal</p>
        </div>
        <div
          className="absolute inset-0 bg-husker text-white flex flex-col items-center justify-center px-6 transition-all"
          style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
        >
          <p className="text-xl font-bold">Ready?</p>
          <p className="text-sm">Release to choose your path.</p>
        </div>
        <div className="absolute inset-0 border-4 border-white/60 rounded-2xl pointer-events-none" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-200">
        Drag the banana sticker. <span className="font-semibold">Press B</span> to prime the peel.
      </p>
    </div>
  );
}
