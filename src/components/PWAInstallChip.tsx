import { useSettings } from '../stores/settings';

export function PWAInstallChip() {
  const { promptInstall } = useSettings();
  return (
    <button type="button" className="chip" onClick={promptInstall}>
      <span role="img" aria-hidden="true">
        🍌
      </span>
      Add to Home Screen
    </button>
  );
}
