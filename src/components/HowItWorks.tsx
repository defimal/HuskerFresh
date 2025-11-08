const steps = [
  { icon: '🍌', title: 'Give', blurb: 'Peel, pledge, done.' },
  { icon: '🎟', title: 'Credit', blurb: 'We match in real time.' },
  { icon: '🍽', title: 'Eat', blurb: 'Pick up discreetly.' }
];

export function HowItWorks() {
  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3 text-center" aria-label="How it works">
      {steps.map((step) => (
        <div key={step.title} className="bg-white/90 dark:bg-huskerDark/70 rounded-3xl p-6 border border-white/40 shadow">
          <p className="text-4xl" aria-hidden="true">
            {step.icon}
          </p>
          <p className="font-semibold">{step.title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-200">{step.blurb}</p>
        </div>
      ))}
    </section>
  );
}
