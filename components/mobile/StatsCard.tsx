export function StatsCard() {
  return (
    <section className="grid grid-cols-3 gap-2">
      <Stat label="Rating" value="4.9" />
      <Stat label="Deals" value="12" />
      <Stat label="Success" value="98%" />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[#fbfff5] p-3 text-center shadow-sm">
      <p className="text-lg font-black">{value}</p>
      <p className="text-xs font-bold text-[#66735c]">{label}</p>
    </div>
  );
}
