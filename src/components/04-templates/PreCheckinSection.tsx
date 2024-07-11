import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { TheFooterNavbar, TheHeader } from "@/components/01-atoms";

export const PreCheckinSection = () => {
  const router = useRouter();
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center"
        marginBottom="60px"
      >
        <Flex flexDirection={"column"} gap={2}>
          <Button onClick={() => router.push("my-badge")}>My Badges</Button>
          <Button onClick={() => router.push("give-badge")}>Give Badges</Button>

          {/* // <Button
            //   onClick={() =>
            //     router.push(isCheckedIn ? "check-out" : "check-in")
            //   }
            // >
            //   {isCheckedIn ? "Check Out" : "Check In"}
            // </Button> */}
        </Flex>
      </Box>

      <TheFooterNavbar />
    </Flex>
  );
};
