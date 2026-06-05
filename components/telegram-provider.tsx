"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type TelegramWebApp = {
  initData: string;
  colorScheme?: "light" | "dark";
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (color: string) => void;
};

type TelegramContextValue = {
  isTelegram: boolean;
  initData: string;
  colorScheme: "light" | "dark";
};

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  initData: "",
  colorScheme: "light"
});

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<TelegramContextValue>({
    isTelegram: false,
    initData: "",
    colorScheme: "light"
  });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      return;
    }

    webApp.ready();
    webApp.expand();
    webApp.setHeaderColor?.("#0ea5e9");

    setValue({
      isTelegram: true,
      initData: webApp.initData,
      colorScheme: webApp.colorScheme ?? "light"
    });
  }, []);

  const contextValue = useMemo(() => value, [value]);

  return <TelegramContext.Provider value={contextValue}>{children}</TelegramContext.Provider>;
}

export function useTelegram() {
  return useContext(TelegramContext);
}
