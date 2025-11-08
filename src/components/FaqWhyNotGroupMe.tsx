const items = ['Instant matching', 'N-Card verification', 'Anonymous dignity', 'Real-time hall hours'];

export function FaqWhyNotGroupMe() {
  return (
    <div className="bg-white/80 dark:bg-huskerDark/80 p-6 rounded-3xl shadow-lg border border-white/40">
      <h2 className="text-xl font-semibold">Why Not GroupMe?</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-husker" aria-hidden="true">
              •
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
