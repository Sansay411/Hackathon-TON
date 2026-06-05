"use client";

import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Home, Plus, Search, UserRound } from "lucide-react";
import { FloatingActionButton } from "@/components/mobile/FloatingActionButton";

type BottomNavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  center?: boolean;
};

const items: BottomNavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/marketplace", label: "Jobs", icon: Search },
  { href: "/deals/new", label: "Create", icon: Plus, center: true },
  { href: "/deals", label: "Deals", icon: BriefcaseBusiness },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="relative grid h-20 grid-cols-5 items-center rounded-[30px] border border-[#33412b] bg-[#11180f] px-2 shadow-[0_18px_50px_rgba(17,24,15,0.32)]">
        <FloatingActionButton isActive={pathname === "/deals/new"} />
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          if (item.center) {
            return (
              <Link key={item.label} className="flex flex-col items-center gap-1 pt-8 text-[11px] font-black text-[#c8ff45]" href={item.href}>
                <span className="sr-only">Create</span>
                {item.label}
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black transition ${
                isActive ? "bg-[#c8ff45] text-[#11180f]" : "text-[#d7e5c9]"
              }`}
              href={item.href}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[#11180f]" : "text-[#f4ffe9]"}`} strokeWidth={2.4} />
              <span className={isActive ? "text-[#11180f]" : "text-[#d7e5c9]"}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
