import { useCallback, useRef, useState, type PointerEventHandler } from 'react';

const PEEL_THRESHOLD = 95;

export function usePeelGesture({
  onComplete,
  announce
}: {
  onComplete: () => void;
  announce?: (message: string) => void;
}) {
  const [progress, setProgress] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startProgress = useRef(0);

  const updateAnnouncement = useCallback(
    (message: string) => {
      if (announce) announce(message);
    },
    [announce]
  );

  const handlePointerDown = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      dragging.current = true;
      startX.current = event.clientX;
      startProgress.current = progress;
      event.currentTarget.setPointerCapture(event.pointerId);
      updateAnnouncement('Peel started');
    },
    [progress, updateAnnouncement]
  );

  const handlePointerMove = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      if (!dragging.current) return;
      const delta = event.clientX - startX.current;
      const width = 240;
      const next = Math.min(100, Math.max(0, startProgress.current + (delta / width) * 100));
      setProgress(next);
      updateAnnouncement(`Peeled ${Math.round(next)}%`);
    },
    [updateAnnouncement]
  );

  const reset = useCallback(() => {
    setProgress(0);
    updateAnnouncement('Resetting peel');
  }, [updateAnnouncement]);

  const finish = useCallback(() => {
    dragging.current = false;
    if (progress >= PEEL_THRESHOLD) {
      setProgress(100);
      onComplete();
      setTimeout(() => setProgress(0), 600);
    } else {
      reset();
    }
  }, [onComplete, progress, reset]);

  const handlePointerUp = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      if (!dragging.current) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      finish();
    },
    [finish]
  );

  const handlePointerLeave = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    reset();
  }, [reset]);

  const handleKeyboardActivate = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const prime = useCallback(() => {
    setProgress((prev) => Math.min(100, prev + 30));
    updateAnnouncement('Peel primed — press space to finish');
  }, [updateAnnouncement]);

  return {
    progress,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handleKeyboardActivate,
    prime
  };
}
