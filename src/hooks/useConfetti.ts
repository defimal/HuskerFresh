import { useCallback } from 'react';
import confetti, { Options } from 'canvas-confetti';
import { useSettings } from '../stores/settings';

export function useConfetti() {
  const { reducedMotion } = useSettings();
  return useCallback(
    (options?: Options) => {
      if (reducedMotion) return;
      confetti({
        origin: { y: 0.6 },
        spread: 70,
        particleCount: 80,
        colors: ['#FFD84D', '#D00000', '#FFFFFF'],
        ...options
      });
    },
    [reducedMotion]
  );
}
