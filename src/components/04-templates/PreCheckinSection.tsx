import { Box, Button, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
// import { useAccount } from "wagmi";

import { TheFooterNavbar, TheHeader } from "@/components/01-atoms";

import useFetchEASData from "../../hooks/useFetchEASData";
import { VILLAGER_QUERY } from "../../lib/client/schema_queries";

//OBS - Code working but could use some refinement
//TODO - Adjust typing
export const PreCheckinSection = () => {
  const router = useRouter();
  const abiCoder = new ethers.AbiCoder();
  // const { address /*isConnected*/ } = useAccount();

  //variable to be passed to the fetchEASdata hook
  const VARIABLES = {
    where: {
      id: "0xcb74f95269512c5cb95c9f854a8ec8fe015d453f1bbff52d83ffd894dfec1883",
    },
    attestationsWhere2: {
      recipient: {
        equals: "0x9bc0fD0Dd492437D6217A12807E81b4A72399379", //Use `address` to get the signed in user's address
      },
    },
  };
  //Decode function to decode an element from the `attestationsArray`
  const decodeAttestationData = (encodedData) => {
    try {
      const decoded = abiCoder.decode(["string"], encodedData);
      return decoded[0];
    } catch (error) {
      console.error("Error decoding attestation data:", error);
      return null;
    }
  };

  //Destructuring the result of useFetchEASData to `data`
  const { data } = useFetchEASData(VILLAGER_QUERY, VARIABLES);

  //"Cleaning" the nested object into a single array
  const attestationsArray = data?.data.schema?.attestations || [];

  //Creating a decoded array
  const decodedAttestationsArray = attestationsArray.map((attestation) =>
    decodeAttestationData(attestation.data),
  );

  const hasCheckinAttestation = decodedAttestationsArray.some(
    (decodedData) => decodedData && decodedData.includes("Check-in"),
  );

  const hasCheckoutAttestation = decodedAttestationsArray.some(
    (decodedData) => decodedData && decodedData.includes("Check-out"),
  );
  //Passing each element of the decoded array to be validaded regarding its data value
  const isCheckedIn = decodedAttestationsArray.some(
    (decodedData) =>
      decodedData && hasCheckinAttestation && !hasCheckoutAttestation,
  );

  const hasBothAttestations = hasCheckinAttestation && hasCheckoutAttestation;

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

          {!hasBothAttestations && (
            <Button
              onClick={() =>
                router.push(isCheckedIn ? "check-out" : "check-in")
              }
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </Button>
          )}
        </Flex>
      </Box>

      <TheFooterNavbar />
    </Flex>
  );
};
