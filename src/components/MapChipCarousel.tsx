import { useEffect, useMemo, useRef, useState } from 'react';
import { useHalls, DiningHall } from '../stores/halls';
import { useSettings } from '../stores/settings';

let maplibrePromise: Promise<typeof import('maplibre-gl')> | null = null;

async function loadMaplibre() {
  if (!maplibrePromise) {
    maplibrePromise = import('maplibre-gl');
  }
  return maplibrePromise;
}

export function MapChipCarousel({ onFocusRegister }: { onFocusRegister?: (focuser: () => void) => void }) {
  const { halls, openCount } = useHalls();
  const { openModal } = useSettings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<import('maplibre-gl').Map | null>(null);
  const markerRef = useRef<import('maplibre-gl').Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  const activeHall: DiningHall | null = useMemo(() => {
    if (!selectedId) return halls[0] ?? null;
    return halls.find((hall) => hall.id === selectedId) ?? halls[0] ?? null;
  }, [halls, selectedId]);

  useEffect(() => {
    if (!selectedId && halls[0]) setSelectedId(halls[0].id);
  }, [halls, selectedId]);

  useEffect(() => {
    if (!onFocusRegister) return;
    const focusNearest = () => {
      const button = chipRef.current?.querySelector<HTMLButtonElement>('button[data-open="true"]');
      button?.focus();
    };
    onFocusRegister(focusNearest);
  }, [onFocusRegister, halls]);

  useEffect(() => {
    if (!containerRef.current || !activeHall) return;
    let cancelled = false;
    loadMaplibre().then(({ Map, Marker }) => {
      if (cancelled) return;
      if (!mapRef.current) {
        mapRef.current = new Map({
          container: containerRef.current!,
          style: 'https://demotiles.maplibre.org/style.json',
          center: [activeHall.lng, activeHall.lat],
          zoom: 15,
          interactive: false
        });
        markerRef.current = new Marker({ color: '#D00000' })
          .setLngLat([activeHall.lng, activeHall.lat])
          .addTo(mapRef.current);
      } else {
        mapRef.current.jumpTo({ center: [activeHall.lng, activeHall.lat], zoom: 15 });
        markerRef.current?.setLngLat([activeHall.lng, activeHall.lat]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeHall]);

  if (!activeHall) return null;

  return (
    <div className="bg-white/80 dark:bg-huskerDark/80 p-6 rounded-3xl shadow-lg border border-white/40" ref={chipRef}>
      <h2 className="text-2xl font-semibold">Dining halls open now</h2>
      <p className="text-sm text-slate-600 dark:text-slate-200">
        {openCount ? `${openCount} open on campus` : 'Checking hours…'}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {halls.map((hall) => (
          <button
            key={hall.id}
            type="button"
            data-open={hall.status === 'open'}
            className={`chip ${selectedId === hall.id ? 'bg-husker text-white' : ''}`}
            onClick={() => setSelectedId(hall.id)}
          >
            {hall.name}
            <span className={`ml-2 text-xs ${hall.status === 'open' ? 'text-emerald-600' : 'text-orange-500'}`}>
              {hall.status === 'open' ? 'Open' : 'Closed'}
            </span>
          </button>
        ))}
      </div>
      <div className="w-full mt-4">
        <div className="mini-map" ref={containerRef} role="img" aria-label="Campus map preview" />
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 dark:bg-midnight/40 border border-slate-200/30">
            <span className={`h-2 w-2 rounded-full ${activeHall.status === 'open' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
            {activeHall.status === 'open' ? 'Open now' : 'Opens soon'}
          </span>
          <a
            className="chip"
            href={`https://www.google.com/maps/search/?api=1&query=${activeHall.lat},${activeHall.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Google Maps
          </a>
          <a
            className="chip"
            href={`https://maps.apple.com/?q=${activeHall.lat},${activeHall.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Apple Maps
          </a>
          <button type="button" className="chip" onClick={() => openModal('pickup', activeHall.pickup_windows)}>
            Pickup windows
          </button>
        </div>
      </div>
    </div>
  );
}
