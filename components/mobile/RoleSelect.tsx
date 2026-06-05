"use client";

import { BriefcaseBusiness, Handshake, UserRound } from "lucide-react";

const roles = [
  { label: "I am a Client", icon: BriefcaseBusiness },
  { label: "I am a Freelancer", icon: UserRound },
  { label: "Both", icon: Handshake }
];

export function RoleSelect() {
  return (
    <div className="grid gap-3">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <button className="flex items-center gap-3 rounded-[24px] bg-white p-4 text-left font-black shadow-sm" key={role.label} type="button">
            <span className="rounded-2xl bg-[#c8ff45] p-3">
              <Icon className="h-5 w-5" />
            </span>
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
