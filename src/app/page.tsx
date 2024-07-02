"use client";
import { Box, Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { TheFooter, TheHeader } from "@/components/01-atoms";
import { MainPane } from "@/components/04-templates";
import { useWindowSize } from "@/hooks";

export default function Home() {
  const { isMobile } = useWindowSize();
  const { isConnected } = useAccount();
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center sm:justify-normal"
      >
        <MainPane />
      </Box>

      {isMobile && !isConnected && <TheFooter />}
    </Flex>
  );
}
