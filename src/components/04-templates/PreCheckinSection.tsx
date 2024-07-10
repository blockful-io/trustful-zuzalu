import { Box, Flex } from "@chakra-ui/react";

import { TheFooterNavbar, TheHeader } from "@/components/01-atoms";

export const PreCheckinSection = () => {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center"
        marginBottom="60px"
      />
      <TheFooterNavbar />
    </Flex>
  );
};
