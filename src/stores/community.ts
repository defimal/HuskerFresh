import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const defaultShoutouts = ['A. donated 1 swipe 🫶', 'Roommate covered dessert 🍰'];

type CommunityContextValue = {
  shoutouts: string[];
  addShoutout: (entry: string) => void;
  hydrate: (entries: string[]) => void;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [shoutouts, setShoutouts] = useState<string[]>(defaultShoutouts);

  const addShoutout = (entry: string) =>
    setShoutouts((prev) => [entry, ...prev].slice(0, 12));

  const hydrate = (entries: string[]) => {
    if (entries.length) setShoutouts(entries);
  };

  return (
    <CommunityContext.Provider value={{ shoutouts, addShoutout, hydrate }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
