"use client";
import { type FC } from "react";

import { Box, Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { useWindowSize } from "@/hooks";

import { BlockfulLogo } from "./icons/BlockfulLogo";

export const TheFooter: FC = () => {
  const { isMobile } = useWindowSize();
  const { isConnected } = useAccount();
  return (
    <Box
      as="footer"
      position="sticky"
      bottom={0}
      zIndex={10}
      textAlign={"center"}
      className="px-6 py-7 sm:p-0"
    >
      {isMobile && !isConnected && (
        <Flex direction={"column"} gap={2}>
          <p className="text-xs font-medium leading-3 uppercase tracking-wider text-gray-200 opacity-50 text-left">
            Created by
          </p>
          <BlockfulLogo />
        </Flex>
      )}
    </Box>
  );
};
