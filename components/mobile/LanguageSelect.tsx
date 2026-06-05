"use client";

const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "kk", label: "Қазақша" }
] as const;

export function LanguageSelect() {
  return (
    <div className="grid gap-3">
      {languages.map((language) => (
        <button className="rounded-[24px] bg-white p-4 text-left font-black shadow-sm" key={language.code} type="button">
          {language.label}
        </button>
      ))}
    </div>
  );
}
