"use client";
import { type ReactNode, useState, useEffect } from "react";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { BadgeContextProvider } from "@/lib/context/BadgeContext";
import { GiveBadgeContextProvider } from "@/lib/context/GiveBadgeContext";
import { WalletContextProvider } from "@/lib/context/WalletContext";
import { wagmiConfig } from "@/wagmi";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const queryClient = new QueryClient();

  const appInfo = {
    appName: "Trustful",
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider resetCSS>
            <RainbowKitProvider
              coolMode
              appInfo={appInfo}
              locale="en-US"
              theme={darkTheme({
                accentColor: "#B1EF42",
                accentColorForeground: "#161617",
              })}
            >
              <WalletContextProvider>
                <GiveBadgeContextProvider>
                  <BadgeContextProvider>
                    {mounted && children}
                  </BadgeContextProvider>
                </GiveBadgeContextProvider>
              </WalletContextProvider>
            </RainbowKitProvider>
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
