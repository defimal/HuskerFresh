import { useSettings } from '../../stores/settings';

export function PickupModal() {
  const { modal, closeModal } = useSettings();
  if (modal.id !== 'pickup') return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Pickup windows" onClick={closeModal}>
      <div className="bg-white dark:bg-huskerDark/90 rounded-2xl p-6 max-w-md w-full relative" onClick={(event) => event.stopPropagation()}>
        <button className="absolute top-3 right-3 text-2xl" onClick={closeModal} aria-label="Close pickup modal">
          ×
        </button>
        <h2 className="text-2xl font-semibold">Pickup windows</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {modal.detail.map((slot) => (
            <li key={slot} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-midnight/50">
              {slot}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
