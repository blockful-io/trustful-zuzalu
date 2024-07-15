import { Box, Flex } from "@chakra-ui/react";

import { TheHeader, TheFooterNavbar } from "@/components/01-atoms";
import { DropdownMenuAdmin } from "@/components/03-organisms";

export const AdminSection = () => {
  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      <TheHeader />
      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center flex-col"
        gap={6}
      >
        <DropdownMenuAdmin />
      </Box>
      <TheFooterNavbar />
    </Flex>
  );
};
