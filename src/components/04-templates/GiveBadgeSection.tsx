import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";

import { BadgeCard, TheHeader } from "@/components/01-atoms";

export const GiveBadgeSection = () => {
  const params = useParams();
  console.log("params in MyBadgeSection", params);
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center"
      >
        <Flex flexDirection={"column"} gap={2} className="w-full">
          <BadgeCard />
        </Flex>
      </Box>
    </Flex>
  );
};
