import type { AiReview } from "@/lib/domain/types";

export function AiReviewPanel({ review }: { review: AiReview }) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">AI review</h2>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
          {review.clarityScore}/100
        </span>
      </div>
      <div className="mt-4 grid gap-4">
        <PanelList title="Missing items" items={review.missingItems} />
        <PanelList title="Dispute risks" items={review.disputeRisks} />
        <PanelList title="Suggested terms" items={review.suggestedTerms} />
      </div>
    </section>
  );
}

function PanelList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
