import { useSettings } from '../stores/settings';

export function DemoBadge() {
  const { demoMode } = useSettings();
  if (!demoMode) return null;
  return (
    <span className="ml-2 animate-pulse text-xs bg-husker text-white px-2 py-0.5 rounded-full">
      Demo
    </span>
  );
}
