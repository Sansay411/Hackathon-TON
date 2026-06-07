"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { TelegramProvider } from "@/components/telegram-provider";
import { LanguageProvider } from "@/components/language-provider";
import { getTonConnectManifestUrl } from "@/lib/ton/network";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TonConnectUIProvider manifestUrl={getTonConnectManifestUrl()}>
          <TelegramProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </TelegramProvider>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
