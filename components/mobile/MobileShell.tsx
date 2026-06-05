import { BottomNav } from "@/components/mobile/BottomNav";
import { DemoBanner } from "@/components/mobile/DemoBanner";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#d8efb1] text-[#182014]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -right-16 top-48 h-56 w-56 rounded-full bg-[#229ED9]/15 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-[#c8ff45]/30 blur-3xl" />
      </div>
      <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-36 pt-4">
        <DemoBanner />
        {children}
      </div>
      <BottomNav />
    </main>
  );
}
