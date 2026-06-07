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

function persistLanguage(language: WorkPayLanguage) {
  window.localStorage.setItem(storageKey, language);
  document.cookie = `${storageKey}=${language}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageProvider({
  children,
  initialLanguage = "en"
}: {
  children: React.ReactNode;
  initialLanguage?: WorkPayLanguage;
}) {
  const [language, setLanguageState] = useState<WorkPayLanguage>(initialLanguage);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const resolved = normalizeLanguage(saved ?? navigator.language);
    if (resolved !== language) {
      setLanguageState(resolved);
    }
    persistLanguage(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = useCallback((nextLanguage: WorkPayLanguage) => {
    persistLanguage(nextLanguage);
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
