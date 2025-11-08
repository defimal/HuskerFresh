import { useSettings } from '../stores/settings';

export function TrustRibbon() {
  const { openModal } = useSettings();
  return (
    <section className="mt-8 bg-white/90 dark:bg-huskerDark/80 rounded-3xl p-6 shadow-lg border border-white/30 text-center">
      <p className="text-2xl font-semibold">Anonymous by default. Your dignity is our priority.</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">
        Verified with N-Card • Staff-approved pickups • You are not alone.
      </p>
      <button type="button" className="chip mt-4" onClick={() => openModal('privacy')}>
        Learn how we protect privacy
      </button>
    </section>
  );
}
