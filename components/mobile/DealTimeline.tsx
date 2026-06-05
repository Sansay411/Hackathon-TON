import { Check, Circle } from "lucide-react";

const timeline = [
  { label: "Deal created", state: "done" },
  { label: "AI reviewed", state: "done" },
  { label: "Waiting payment", state: "current" },
  { label: "Funded on TON", state: "pending" },
  { label: "Work submitted", state: "pending" },
  { label: "Payment released", state: "pending" }
] as const;

export function DealTimeline() {
  return (
    <section className="rounded-[30px] border border-white/70 bg-[#fbfff5] p-5 shadow-[0_14px_34px_rgba(17,24,15,0.09)]">
      <h2 className="text-2xl font-black">Transaction timeline</h2>
      <ol className="mt-5 space-y-4">
        {timeline.map((item, index) => (
          <li className="flex gap-3" key={item.label}>
            <div className="flex flex-col items-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${item.state === "pending" ? "bg-white text-[#b7c6a6]" : item.state === "current" ? "bg-[#c8ff45] text-[#182014]" : "bg-[#229ED9] text-white"}`}>
                {item.state === "pending" ? <Circle className="h-3 w-3" /> : <Check className="h-4 w-4" />}
              </span>
              {index < timeline.length - 1 ? <span className="mt-2 h-6 w-px bg-white" /> : null}
            </div>
            <div className="pt-1">
              <p className="font-black">{item.label}</p>
              <p className="text-xs font-semibold text-[#66735c]">{item.state === "current" ? "Current step" : item.state === "done" ? "Completed" : "Pending verification"}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
