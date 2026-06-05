"use client";

import { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "kk", label: "Қазақша" }
] as const;

export function LanguageSelect() {
  const [selected, setSelected] = useState<(typeof languages)[number]["code"]>("en");

  return (
    <div className="grid gap-3">
      {languages.map((language) => (
        <button
          className={`rounded-[24px] p-4 text-left font-black shadow-sm transition ${
            selected === language.code ? "bg-[#229ED9] text-white" : "bg-white text-[#182014]"
          }`}
          key={language.code}
          onClick={() => setSelected(language.code)}
          type="button"
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
