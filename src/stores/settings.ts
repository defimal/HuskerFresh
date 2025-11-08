import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useImpact } from './impact';
import { useHalls } from './halls';
import { useCommunity } from './community';

export type ModalId = 'privacy' | 'pickup' | null;

type SettingsContextValue = {
  textSize: 'base' | 'lg';
  setTextSize: (size: 'base' | 'lg') => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
  reducedMotion: boolean;
  openModal: (id: Exclude<ModalId, null>, detail?: string[]) => void;
  modal: { id: ModalId; detail: string[] };
  promptInstall: () => void;
  closeModal: () => void;
};

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type InstallPrompt = BeforeInstallPromptEvent | null;

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { incrementDonations } = useImpact();
  const { randomHall } = useHalls();
  const { addShoutout } = useCommunity();

  const [textSize, setTextSize] = useState<'base' | 'lg'>('base');
  const [demoMode, setDemoMode] = useState(false);
  const [modal, setModal] = useState<{ id: ModalId; detail: string[] }>({ id: null, detail: [] });
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt>(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  useEffect(() => {
    if (!demoMode) return;
    const interval = setInterval(() => {
      const hall = randomHall();
      if (!hall) return;
      incrementDonations(1);
      addShoutout(`${hall.name} donated 1 swipe 🫶`);
    }, 5000);
    return () => clearInterval(interval);
  }, [demoMode, randomHall, incrementDonations, addShoutout]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      textSize,
      setTextSize,
      demoMode,
      toggleDemoMode: () => setDemoMode((prev) => !prev),
      reducedMotion,
      modal,
      openModal: (id, detail = []) => setModal({ id, detail }),
      closeModal: () => setModal({ id: null, detail: [] }),
      promptInstall: () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.finally(() => setInstallPrompt(null));
      }
    }),
    [textSize, demoMode, reducedMotion, modal, installPrompt]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
