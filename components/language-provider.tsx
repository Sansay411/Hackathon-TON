"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, getDictionary, normalizeLanguage, type Dictionary } from "@/lib/i18n";
import type { WorkPayLanguage } from "@/lib/domain/types";

type LanguageContextValue = {
  language: WorkPayLanguage;
  setLanguage: (language: WorkPayLanguage) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => undefined,
  t: dictionaries.en
});

const storageKey = "workpay:language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<WorkPayLanguage>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    setLanguageState(normalizeLanguage(saved ?? navigator.language));
  }, []);

  const setLanguage = useCallback((nextLanguage: WorkPayLanguage) => {
    window.localStorage.setItem(storageKey, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: getDictionary(language)
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
