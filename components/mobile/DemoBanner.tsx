export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return null;
  }
  return (
    <div className="mb-3 rounded-full bg-[#182014] px-4 py-2 text-center text-[11px] font-black text-[#c8ff45] shadow-sm">
      Demo Mode: payments require provider setup. Product flow is live.
    </div>
  );
}
