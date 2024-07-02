"use client";
import { type FC } from "react";

import { HStack, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { useWindowSize } from "@/hooks";

import { TrustfulIcon } from "./icons/TrustfulIcon";

export const TheHeader: FC = () => {
  const { isMobile } = useWindowSize();
  const { isConnected } = useAccount();
  return (
    <HStack
      as="header"
      p={"1.5rem"}
      position="sticky"
      top={0}
      zIndex={10}
      justifyContent={"space-between"}
      className="p-6 sm:px-[60px] sm:py-[20px]"
    >
      <HStack>
        <TrustfulIcon />
        <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
          Trustful
        </Heading>
      </HStack>

      <HStack>
        {isMobile && !isConnected && <ConnectButton label="Connect" />}
      </HStack>
    </HStack>
  );
};
