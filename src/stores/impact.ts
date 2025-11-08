import { createContext, ReactNode, useContext, useReducer, useEffect, useCallback } from 'react';

export type ImpactState = {
  fedThisWeek: number;
  swipesDonated: number;
  avgWaitSeconds: number;
  currentIndex: number;
  highlight: boolean;
};

type ImpactAction =
  | { type: 'increment'; count: number }
  | { type: 'request' }
  | { type: 'cycle' }
  | { type: 'clear-highlight' }
  | { type: 'hydrate'; payload: Partial<ImpactState> };

const initialState: ImpactState = {
  fedThisWeek: 128,
  swipesDonated: 24,
  avgWaitSeconds: 420,
  currentIndex: 0,
  highlight: false
};

function impactReducer(state: ImpactState, action: ImpactAction): ImpactState {
  switch (action.type) {
    case 'increment': {
      return {
        ...state,
        swipesDonated: state.swipesDonated + action.count,
        fedThisWeek: state.fedThisWeek + action.count * 2,
        highlight: true
      };
    }
    case 'request': {
      return {
        ...state,
        avgWaitSeconds: Math.max(120, state.avgWaitSeconds - 15)
      };
    }
    case 'cycle': {
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % 3
      };
    }
    case 'clear-highlight': {
      return { ...state, highlight: false };
    }
    case 'hydrate': {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

type ImpactContextValue = {
  state: ImpactState;
  incrementDonations: (count?: number) => void;
  recordRequest: () => void;
  hydrate: (payload: Partial<ImpactState>) => void;
  cycle: () => void;
};

const ImpactContext = createContext<ImpactContextValue | undefined>(undefined);

export function ImpactProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(impactReducer, initialState);

  const incrementDonations = useCallback((count = 1) => dispatch({ type: 'increment', count }), []);
  const recordRequest = useCallback(() => dispatch({ type: 'request' }), []);
  const hydrate = useCallback((payload: Partial<ImpactState>) => dispatch({ type: 'hydrate', payload }), []);
  const cycle = useCallback(() => dispatch({ type: 'cycle' }), []);

  useEffect(() => {
    if (state.highlight) {
      const timer = setTimeout(() => dispatch({ type: 'clear-highlight' }), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.highlight]);

  return (
    <ImpactContext.Provider value={{ state, incrementDonations, recordRequest, hydrate, cycle }}>
      {children}
    </ImpactContext.Provider>
  );
}

export const statTemplates = [
  { key: 'fedThisWeek', label: 'Huskers Fed This Week' },
  { key: 'swipesDonated', label: 'Swipes Donated Today' },
  { key: 'avgWaitSeconds', label: 'Avg. Wait Time' }
] as const;

export function useImpact() {
  const ctx = useContext(ImpactContext);
  if (!ctx) throw new Error('useImpact must be used within ImpactProvider');
  return ctx;
}

export function useImpactTicker() {
  const { cycle } = useImpact();
  useEffect(() => {
    const id = setInterval(() => cycle(), 3000);
    return () => clearInterval(id);
  }, [cycle]);
}
