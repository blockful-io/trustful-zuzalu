"use client";
import { type FC } from "react";

import { HStack, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { DarkModeButton, TrustfulIcon } from "@/components/01-atoms";

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
        <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
          Trustful
        </Heading>
      </HStack>

      <HStack>
        {isConnected && <ConnectButton />}
        <DarkModeButton />
      </HStack>
    </HStack>
  );
};
