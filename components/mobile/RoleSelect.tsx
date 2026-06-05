"use client";

import { useState } from "react";
import { BriefcaseBusiness, Handshake, UserRound } from "lucide-react";

const roles = [
  { label: "I am a Client", icon: BriefcaseBusiness },
  { label: "I am a Freelancer", icon: UserRound },
  { label: "Both", icon: Handshake }
];

export function RoleSelect() {
  const [selected, setSelected] = useState(roles[0].label);

  return (
    <div className="grid gap-3">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <button
            className={`flex items-center gap-3 rounded-[24px] p-4 text-left font-black shadow-sm transition ${
              selected === role.label ? "bg-[#182014] text-white" : "bg-white text-[#182014]"
            }`}
            key={role.label}
            onClick={() => setSelected(role.label)}
            type="button"
          >
            <span className={`rounded-2xl p-3 ${selected === role.label ? "bg-[#c8ff45] text-[#182014]" : "bg-[#c8ff45]"}`}>
              <Icon className="h-5 w-5" />
            </span>
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
