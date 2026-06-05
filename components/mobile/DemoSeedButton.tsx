"use client";

import { useState } from "react";
import { DatabaseZap } from "lucide-react";

export function DemoSeedButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return null;
  }
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-[#229ED9] px-4 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(34,158,217,0.2)] disabled:opacity-70"
      disabled={state === "loading"}
      onClick={async () => {
        setState("loading");
        try {
          const response = await fetch("/api/demo/seed", { method: "POST" });
          if (response.ok) {
            const payload = await response.json();
            window.localStorage.setItem("workpay-demo-seed", JSON.stringify({ loadedAt: new Date().toISOString(), payload }));
            setState("done");
            return;
          }
          setState("error");
        } catch {
          setState("error");
        }
      }}
      type="button"
    >
      <DatabaseZap className="h-4 w-4" />
      {state === "loading" ? "Loading..." : state === "done" ? "Demo Data Loaded" : state === "error" ? "Demo Seed Failed" : "Load Demo Data"}
    </button>
  );
}
