const steps = ["Created", "AI reviewed", "Funded", "Submitted", "Approved", "Released"];

export function Timeline() {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="font-semibold">Timeline</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li className="flex items-center gap-3 text-sm" key={step}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs">{index + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
