"use client";
import { Box, Flex } from "@chakra-ui/react";

import { TheFooter, TheHeader } from "@/components/01-atoms";
import { MainPane } from "@/components/04-templates";

export default function Home() {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />

      <Box as="main" flex={1} p={4}>
        <MainPane />
      </Box>

      <TheFooter />
    </Flex>
  );
}
