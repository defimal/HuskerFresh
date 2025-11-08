import { useCallback, useRef } from 'react';
import { ImpactProvider } from './stores/impact';
import { HallProvider } from './stores/halls';
import { SettingsProvider, useSettings } from './stores/settings';
import { CommunityProvider } from './stores/community';
import { HeroPeelCTA } from './components/HeroPeelCTA';
import { ImpactOMeter } from './components/ImpactOMeter';
import { TrustRibbon } from './components/TrustRibbon';
import { GiveSwipeCard } from './components/SplitCards/GiveSwipeCard';
import { NeedMealCard } from './components/SplitCards/NeedMealCard';
import { MapChipCarousel } from './components/MapChipCarousel';
import { HowItWorks } from './components/HowItWorks';
import { ShoutoutsTicker } from './components/ShoutoutsTicker';
import { FaqWhyNotGroupMe } from './components/FaqWhyNotGroupMe';
import { PrivacyModal } from './components/Modals/PrivacyModal';
import { PickupModal } from './components/Modals/PickupModal';
import { HeaderControls } from './components/HeaderControls';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useConfetti } from './hooks/useConfetti';

function AppShell() {
  const { textSize } = useSettings();
  const celebrate = useConfetti();
  const peelRef = useRef<() => void>(() => undefined);
  const hallFocusRef = useRef<() => void>(() => undefined);

  const handlePeelShortcut = useCallback(() => peelRef.current?.(), []);
  const handleFocusHall = useCallback(() => hallFocusRef.current?.(), []);
  const handleSecret = useCallback(() => celebrate({ emojis: ['🍌', '❤️'], scalar: 1.5, particleCount: 20 }), [celebrate]);

  useKeyboardShortcuts({
    onPeelStart: handlePeelShortcut,
    onFocusOpenHall: handleFocusHall,
    onSecret: handleSecret
  });

  return (
    <div className={`min-h-screen bg-[url('/assets/corn-texture.png')] ${textSize === 'lg' ? 'text-lg' : 'text-base'}`}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-huskerDark/80 backdrop-blur-md border-b border-white/30 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/banana.svg" alt="Peel & Feed banana" className="w-12 h-12 drop-shadow" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-husker">Peel &amp; Feed</p>
              <p className="text-xl font-semibold">Huskers vs. Hunger</p>
            </div>
          </div>
          <HeaderControls />
        </div>
      </header>
      <main id="main-content" className="max-w-6xl mx-auto px-4 pb-16">
        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="bg-white/90 dark:bg-huskerDark/80 rounded-3xl p-8 shadow-xl border border-white/50 relative overflow-hidden">
            <HeroPeelCTA onPrimeChange={(fn) => (peelRef.current = fn)} />
            <div className="mt-6">
              <ImpactOMeter />
            </div>
          </div>
          <div className="space-y-4">
            <MapChipCarousel onFocusRegister={(fn) => (hallFocusRef.current = fn)} />
            <FaqWhyNotGroupMe />
          </div>
        </section>
        <TrustRibbon />
        <section className="mt-10 grid gap-6 lg:grid-cols-2" id="flows">
          <GiveSwipeCard />
          <NeedMealCard />
        </section>
        <HowItWorks />
        <ShoutoutsTicker />
        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="bg-white/90 dark:bg-huskerDark/80 rounded-3xl p-6 border border-white/40">
            <h3 className="text-xl font-semibold">Safety, dignity, accessibility</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Skip-to-content, focus rings, keyboard shortcuts.</li>
              <li>Hide-my-name locked on by default.</li>
              <li>WCAG AA palette + reduced motion support.</li>
              <li>Offline-ready with cached hall hours.</li>
            </ul>
          </div>
          <div className="bg-white/90 dark:bg-huskerDark/80 rounded-3xl p-6 border border-white/40">
            <h3 className="text-xl font-semibold">Night game mode</h3>
            <p className="text-sm text-slate-600 dark:text-slate-200">
              Auto-detects dark mode for a deep Husker red gradient with starry cornfield glow.
            </p>
            <p className="mt-2 text-sm">
              Typing <strong>GO BIG RED</strong> celebrates with mini bananas.
            </p>
          </div>
        </section>
      </main>
      <footer className="py-10 text-center text-sm text-slate-600 dark:text-slate-300">
        Built for CornHacks • Works offline • <a href="#flows" className="underline">
          Jump to flows
        </a>
      </footer>
      <PrivacyModal />
      <PickupModal />
    </div>
  );
}

export default function App() {
  return (
    <ImpactProvider>
      <CommunityProvider>
        <HallProvider>
          <SettingsProvider>
            <AppShell />
          </SettingsProvider>
        </HallProvider>
      </CommunityProvider>
    </ImpactProvider>
  );
}
