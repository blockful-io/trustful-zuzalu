"use client";
import { useEffect, useState } from "react";

import { watchChainId } from "@wagmi/core";
import { useChainId } from "wagmi";

import { wagmiConfig } from "@/wagmi";

export const useSupportedNetwork = () => {
  const [isNetworkSupported, setIsNetworkSupported] = useState<boolean>(false);
  const chain = useChainId();

  const unwatch = watchChainId(wagmiConfig, {
    onChange(chainId) {
      console.log("Chain ID changed!", chainId);
    },
  });

  useEffect(() => {
    if (chain && chain !== wagmiConfig.chains[0].id) {
      setIsNetworkSupported(false);
    } else {
      setIsNetworkSupported(true);
    }
  }, [unwatch]);

  return {
    isNetworkSupported,
  };
};
