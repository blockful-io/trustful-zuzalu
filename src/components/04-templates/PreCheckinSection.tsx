import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { TheHeader } from "@/components/01-atoms";

import useFetchEASData from "../../hooks/useFetchEASData";
import { VILLAGER_QUERY } from "../../lib/client/schema_queries";

//TODO - In progress. Hide check-in button if `checked-in`status is present in the attestation
export const PreCheckinSection = () => {
  const router = useRouter();

  // const { address /*isConnected*/ } = useAccount();

  const VARIABLES = {
    where: {
      id: "0xd130b9591f22bb9653f125ed00ff2d7d88b41d64acfd962365b42fe720c295aa", //Manager - Trocar pro villager
    },
    attestationsWhere2: {
      recipient: {
        equals: "0x07231e0fd9F668d4aaFaE7A5D5f432B8E6e4Fe51",
      },
    },
  };

  const { data } = useFetchEASData(VILLAGER_QUERY, VARIABLES);
  const attestationsArray = data?.data?.schema?.attestations ?? [];
  console.log("data", data);
  console.log("attestationsArray", attestationsArray);

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
          <Button onClick={() => router.push("check-in")}>
            {" "}
            Check In
          </Button>{" "}
          {/*Change to Check out if user has Check in badge */}
        </Flex>
      </Box>
    </Flex>
  );
};
