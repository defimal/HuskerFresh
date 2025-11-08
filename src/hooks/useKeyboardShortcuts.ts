import { useEffect } from 'react';

const SECRET = 'GOBIGRED';

export function useKeyboardShortcuts({
  onPeelStart,
  onFocusOpenHall,
  onSecret
}: {
  onPeelStart: () => void;
  onFocusOpenHall: () => void;
  onSecret: () => void;
}) {
  useEffect(() => {
    const buffer: string[] = [];
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typingContext = target && ['INPUT', 'TEXTAREA'].includes(target.tagName);
      if (event.key.toLowerCase() === 'b' && !typingContext) {
        event.preventDefault();
        onPeelStart();
      }
      if (event.key.toLowerCase() === 'n' && !typingContext) {
        event.preventDefault();
        onFocusOpenHall();
      }
      if (/^[a-zA-Z ]$/.test(event.key)) {
        buffer.push(event.key.toUpperCase().replace(' ', ''));
        if (buffer.length > SECRET.length) buffer.shift();
        if (buffer.join('').endsWith(SECRET)) {
          onSecret();
          buffer.length = 0;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPeelStart, onFocusOpenHall, onSecret]);
}
