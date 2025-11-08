import { useEffect, useState } from 'react';
import { useHalls } from '../../stores/halls';
import { useImpact } from '../../stores/impact';

const windows = ['Next 30 min', 'Lunch rush', 'Dinner'];

export function NeedMealCard() {
  const { halls, nearestOpen } = useHalls();
  const { recordRequest } = useImpact();
  const [preferred, setPreferred] = useState('');
  const [windowChoice, setWindowChoice] = useState(windows[0]);
  const [hideName, setHideName] = useState(true);
  const [match, setMatch] = useState<{ title: string; instructions: string } | null>(null);

  useEffect(() => {
    if (!preferred && halls[0]) {
      setPreferred(halls[0].name);
    }
  }, [halls, preferred]);

  const submit = () => {
    const hall = halls.find((item) => item.name === preferred) ?? nearestOpen();
    if (!hall) return;
    recordRequest();
    setMatch({
      title: `${hall.name} has a match!`,
      instructions: `Pick up near ${hall.pickup_windows?.[0] || 'the main desk'} during ${windowChoice}. Staff knows you as "${
        hideName ? 'Anonymous Husker' : 'Friend'
      }".`
    });
  };

  return (
    <article className="bg-white/90 dark:bg-huskerDark/80 rounded-3xl p-6 shadow-xl border border-white/40">
      <header className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-hidden="true">
          🍽
        </span>
        <div>
          <p className="uppercase text-xs tracking-[0.3em] text-husker dark:text-banana">Need a meal</p>
          <h3 className="text-2xl font-semibold">One-tap request</h3>
        </div>
      </header>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label className="block text-sm font-medium">
          Preferred hall
          <select className="form-field" value={preferred} onChange={(event) => setPreferred(event.target.value)}>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.name}>
                {hall.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Pickup window
          <select className="form-field" value={windowChoice} onChange={(event) => setWindowChoice(event.target.value)}>
            {windows.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-husker" checked={hideName} onChange={(event) => setHideName(event.target.checked)} />
          Hide my name (default)
        </label>
        <button type="submit" className="button-primary">
          Find me a meal
        </button>
        {match && (
          <div className="bg-white/70 dark:bg-midnight/40 rounded-2xl p-4">
            <p className="text-sm font-semibold">{match.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-200">{match.instructions}</p>
          </div>
        )}
      </form>
    </article>
  );
}
