"use client";
import { type FC } from "react";

import { HStack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { TrustfulIcon } from "@/components/01-atoms";

export const Header: FC = () => {
  const { isConnected } = useAccount();

  return (
    <HStack
      as="header"
      p={"1.5rem"}
      position="sticky"
      top={0}
      zIndex={10}
      justifyContent={"space-between"}
    >
      <HStack>
        <TrustfulIcon />
        <h1 className="text-shadow text-white">Trustful</h1>
      </HStack>

      <HStack>{isConnected && <ConnectButton />}</HStack>
    </HStack>
  );
};
