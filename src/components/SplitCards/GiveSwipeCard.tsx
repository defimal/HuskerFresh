import { useEffect, useReducer } from 'react';
import { useHalls } from '../../stores/halls';
import { useImpact } from '../../stores/impact';
import { useCommunity } from '../../stores/community';
import { useConfetti } from '../../hooks/useConfetti';
import { usePeelGesture } from '../../hooks/usePeelGesture';

const slots = ['Breakfast', 'Lunch', 'Dinner', 'Late night'];

type FormState = {
  hall: string;
  window: string;
  note: string;
  hideName: boolean;
};

type FormAction = { type: 'field'; field: keyof FormState; value: string | boolean } | { type: 'reset'; hall: string };

function reducer(state: FormState, action: FormAction): FormState {
  if (action.type === 'reset') {
    return { hall: action.hall, window: 'Lunch', note: '', hideName: true };
  }
  return { ...state, [action.field]: action.value } as FormState;
}

export function GiveSwipeCard() {
  const { halls } = useHalls();
  const { incrementDonations } = useImpact();
  const { addShoutout } = useCommunity();
  const celebrate = useConfetti();
  const [state, dispatch] = useReducer(reducer, {
    hall: '',
    window: 'Lunch',
    note: '',
    hideName: true
  });

  useEffect(() => {
    if (!state.hall && halls[0]) {
      dispatch({ type: 'field', field: 'hall', value: halls[0].name });
    }
  }, [halls, state.hall]);

  const submit = () => {
    if (!state.hall) return;
    incrementDonations(1);
    addShoutout(`${state.hideName ? 'Anonymous' : 'You'} gifted a swipe at ${state.hall} 🫶`);
    celebrate({ spread: 100, particleCount: 120 });
    dispatch({ type: 'reset', hall: state.hall });
  };

  const {
    progress,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handleKeyboardActivate
  } = usePeelGesture({
    onComplete: submit
  });

  return (
    <article
      id="give-swipe-card"
      tabIndex={-1}
      className="bg-white/90 dark:bg-huskerDark/80 rounded-3xl p-6 shadow-xl border border-white/40 focus-visible:outline focus-visible:outline-banana"
    >
      <header className="flex items-center gap-3">
        <span className="text-3xl" role="img" aria-hidden="true">
          🍌
        </span>
        <div>
          <p className="uppercase text-xs tracking-[0.3em] text-husker dark:text-banana">Give a swipe</p>
          <h3 className="text-2xl font-semibold">15-second donation</h3>
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
          Dining hall
          <select
            className="form-field"
            value={state.hall}
            onChange={(event) => dispatch({ type: 'field', field: 'hall', value: event.target.value })}
          >
            {halls.map((hall) => (
              <option key={hall.id} value={hall.name}>
                {hall.name}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="text-sm font-medium mb-2">Time window</legend>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <label key={slot} className={`chip cursor-pointer ${state.window === slot ? 'bg-husker text-white' : ''}`}>
                <input
                  type="radio"
                  className="sr-only"
                  name="donation-slot"
                  value={slot}
                  checked={state.window === slot}
                  onChange={() => dispatch({ type: 'field', field: 'window', value: slot })}
                />
                {slot}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium">
          Optional note
          <textarea
            className="form-field"
            rows={2}
            value={state.note}
            placeholder="Allergens, meet-up details"
            onChange={(event) => dispatch({ type: 'field', field: 'note', value: event.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-husker"
            checked={state.hideName}
            onChange={(event) => dispatch({ type: 'field', field: 'hideName', value: event.target.checked })}
          />
          Hide my name (recommended)
        </label>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-200 mb-2">Drag to confirm</p>
          <div
            className="relative w-full h-14 rounded-full border-2 border-dashed border-husker/50 bg-white/80 overflow-hidden cursor-pointer"
            role="button"
            aria-label="Drag to confirm donation"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleKeyboardActivate();
              }
            }}
          >
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-banana to-amber-300" style={{ width: `${progress}%` }} />
            <span className="relative z-10 flex items-center justify-center h-full font-semibold">
              {progress >= 100 ? 'Released!' : 'Peel to send'}
            </span>
          </div>
        </div>
        <button type="submit" className="button-alt w-full">
          Confirm without peel
        </button>
      </form>
    </article>
  );
}
