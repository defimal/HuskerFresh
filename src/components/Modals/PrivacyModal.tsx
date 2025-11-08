import { useSettings } from '../../stores/settings';

export function PrivacyModal() {
  const { modal, closeModal } = useSettings();
  if (modal.id !== 'privacy') return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Privacy details" onClick={closeModal}>
      <div className="bg-white dark:bg-huskerDark/90 rounded-2xl p-6 max-w-md w-full relative" onClick={(event) => event.stopPropagation()}>
        <button className="absolute top-3 right-3 text-2xl" onClick={closeModal} aria-label="Close privacy modal">
          ×
        </button>
        <h2 className="text-2xl font-semibold">Privacy promise</h2>
        <ul className="list-disc pl-6 mt-3 space-y-2 text-sm">
          <li>N-Card check happens client-side; no names displayed.</li>
          <li>Swipes expire from the queue if not claimed in 15 minutes.</li>
          <li>Pickup instructions vanish once read.</li>
        </ul>
      </div>
    </div>
  );
}
