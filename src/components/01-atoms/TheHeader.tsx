"use client";
import { type FC } from "react";

import { Divider, HStack, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { TrustfulIcon } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";

import { TheHeaderMenu } from "./TheHeaderMenu";

export const TheHeader: FC = () => {
  const { isMobile } = useWindowSize();
  const { isConnected } = useAccount();
  const router = useRouter();
  return (
    <>
      <HStack
        as="header"
        p={"1.5rem"}
        position="sticky"
        top={0}
        zIndex={10}
        justifyContent={"space-between"}
        className="p-6 sm:px-[60px] sm:py-[20px]"
      >
        <HStack
          className="cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <TrustfulIcon />
          <Heading
            as="h1"
            fontSize={"1.5rem"}
            className="text-shadow"
            color="white"
          >
            Trustful
          </Heading>
        </HStack>
        <HStack>
          {!isMobile && !isConnected && <ConnectButton label="Connect" />}
          {isConnected && <TheHeaderMenu />}
        </HStack>
      </HStack>
      <Divider className="border-slate-50 opacity-10" />
    </>
  );
};
