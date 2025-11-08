import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useImpact, ImpactState } from './impact';
import { useCommunity } from './community';

export type DiningHall = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'open' | 'closed';
  pickup_windows: string[];
  open_hours: string;
};

const HallsContext = createContext<{
  halls: DiningHall[];
  loading: boolean;
  nearestOpen: () => DiningHall | null;
  randomHall: () => DiningHall | null;
  openCount: number;
  refresh: () => Promise<void>;
} | null>(null);

export function HallProvider({ children }: { children: ReactNode }) {
  const { hydrate } = useImpact();
  const { hydrate: hydrateCommunity } = useCommunity();
  const [halls, setHalls] = useState<DiningHall[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHalls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/demo-data.json');
      const data = await response.json();
      setHalls(data.halls ?? []);
      const payload: Partial<ImpactState> = {};
      if (typeof data.fed_this_week === 'number') payload.fedThisWeek = data.fed_this_week;
      if (typeof data.donations_today === 'number') payload.swipesDonated = data.donations_today;
      if (typeof data.avg_wait_seconds === 'number') payload.avgWaitSeconds = data.avg_wait_seconds;
      if (Object.keys(payload).length) hydrate(payload);
      if (Array.isArray(data.shoutouts)) hydrateCommunity(data.shoutouts);
      return data;
    } finally {
      setLoading(false);
    }
  }, [hydrate, hydrateCommunity]);

  useEffect(() => {
    fetchHalls();
  }, [fetchHalls]);

  const value = useMemo(() => {
    const nearestOpen = () => halls.find((hall) => hall.status === 'open') ?? halls[0] ?? null;
    const randomHall = () => (halls.length ? halls[Math.floor(Math.random() * halls.length)] : null);
    const openCount = halls.filter((hall) => hall.status === 'open').length;
    return {
      halls,
      loading,
      nearestOpen,
      randomHall,
      openCount,
      refresh: fetchHalls
    };
  }, [fetchHalls, halls, loading]);

  return <HallsContext.Provider value={value}>{children}</HallsContext.Provider>;
}

export function useHalls() {
  const ctx = useContext(HallsContext);
  if (!ctx) throw new Error('useHalls must be used within HallProvider');
  return ctx;
}
