type Risk = "Low" | "Medium" | "High";

const riskStyles: Record<Risk, string> = {
  Low: "bg-[#e6f7ff] text-[#00658e] ring-[#c7e7ff]",
  Medium: "bg-[#fff1b8] text-[#6b5300] ring-[#ffe58a]",
  High: "bg-[#ffe0e4] text-[#9f1239] ring-[#ffc2cc]"
};

export function AiRiskBadge({ risk }: { risk: Risk }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${riskStyles[risk]}`}>AI Risk: {risk}</span>;
}
