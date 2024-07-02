"use client";
import { type FC } from "react";

import { HStack, Heading } from "@chakra-ui/react";

import { TrustfulIcon } from "./icons/TrustfulIcon";

export const Header: FC = () => {
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

      {/* <HStack>
        <ConnectButton />
      </HStack> */}
    </HStack>
  );
};
