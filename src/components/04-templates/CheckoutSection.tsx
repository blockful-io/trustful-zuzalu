import { useContext, useEffect, useState } from "react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardHeader,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Icon,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { encodeAbiParameters, parseAbiParameters } from "viem/utils";
import { useAccount } from "wagmi";

import { TheFooterNavbar, TheHeader } from "@/components/01-atoms";
import { useNotify } from "@/hooks";
import { ZUVILLAGE_SCHEMAS } from "@/lib/client/constants";
import { VILLAGER_QUERY } from "@/lib/client/schemaQueries";
import { WalletContext } from "@/lib/context/WalletContext";
import {
  submitAttest,
  type AttestationRequestData,
} from "@/lib/service/attest";
import { fetchEASData } from "@/lib/service/fetchEASData";
import {
  formatTimeDifference,
  getEllipsedAddress,
  getReadableData,
} from "@/utils/formatters";

export const CheckOutSection = () => {
  const { address } = useAccount();
  const toast = useToast();
  const { push } = useRouter();
  const { notifyError } = useNotify();

  const { villagerAttestationCount } = useContext(WalletContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [eventTime, setEventTime] = useState<string[] | null>(null);
  const [EASTxId, setEASTxId] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    if (address) {
      handleQuery();
    }
  }, [address]);

  // Submit attestation
  const handleAttest = async () => {
    if (!address) {
      setLoading(false);
      notifyError({
        title: "No account connected",
        message: "Please connect your wallet.",
      });
      return;
    }

    if (!EASTxId) {
      setLoading(false);
      notifyError({
        title: "Could not find Check-in Badge",
        message: "Please check-in first.",
      });
      return;
    }

    const encodeParam = ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.data;
    const encodeArgs = ["Check-out"];

    const data = encodeAbiParameters(
      parseAbiParameters(encodeParam),
      encodeArgs,
    );

    const attestationRequestData: AttestationRequestData = {
      recipient: address,
      expirationTime: BigInt(0),
      revocable: false,
      refUID: EASTxId,
      data: data,
      value: BigInt(0),
    };

    const response = await submitAttest(
      address,
      ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid,
      attestationRequestData,
    );

    if (response instanceof Error) {
      setLoading(false);
      notifyError({
        title: "Transaction Rejected",
        message: response.message,
      });
      return;
    }

    // TODO: Move to useNotify to create a notifySuccessWithLink function
    toast({
      position: "top-right",
      duration: 4000,
      isClosable: true,
      render: () => (
        <Box
          color="white"
          p={4}
          bg="green.500"
          borderRadius="md"
          boxShadow="lg"
          display="flex"
          alignItems="center"
        >
          <Icon as={CheckCircleIcon} w={6} h={6} mr={3} />
          <Box>
            <Text fontWeight="bold">Success.</Text>
            <Text>
              Badge sent at tx:{" "}
              <Link
                href={`https://optimistic.etherscan.io/tx/${response.transactionHash}`}
                isExternal
                color="white"
                textDecoration="underline"
              >
                {getEllipsedAddress(response.transactionHash)}
              </Link>
            </Text>
          </Box>
        </Box>
      ),
    });

    setLoading(false);
    return;
  };

  // Check the user's check-in timestamp
  const handleQuery = async () => {
    const queryVariables = {
      where: {
        schemaId: {
          equals: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid,
        },
        recipient: {
          equals: address,
        },
      },
    };

    const { response, success } = await fetchEASData(
      VILLAGER_QUERY,
      queryVariables,
    );

    if (!success) {
      notifyError({
        title: "Cannot fetch EAS",
        message: "Error while fetching Attestation data from Subgraphs",
      });
      return;
    }

    if (response === null) {
      notifyError({
        title: "Cannot fetch EAS",
        message: "Subgraph returned error with current query",
      });
      return;
    }

    if (response.data.data.attestations.length === 0) {
      notifyError({
        title: "You have not checked in",
        message: "Please check-in first.",
      });
      push("/pre-checkin");
      return;
    }

    const id = response.data.data.attestations[0].id;
    const timeCreated = response.data.data.attestations[0].timeCreated;
    setEASTxId(id);
    setCheckInDate(getReadableData(Number(timeCreated)));

    if (response.data.data.attestations.length > 1) {
      const timeEnded = response.data.data.attestations[1].timeCreated;
      setCheckOutDate(getReadableData(Number(timeEnded)));
      setEventTime(
        formatTimeDifference(Number(timeCreated), Number(timeEnded)),
      );
    } else {
      setEventTime(formatTimeDifference(Number(timeCreated)));
    }
  };
  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      <TheHeader />
      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col items-center"
        gap={6}
      >
        <Card
          className="px-8 py-6 mt-6"
          background={"#212223"}
          border={2}
          borderRadius={16}
          gap={4}
        >
          <CardHeader
            gap={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"column"}
            p={0}
            pb={4}
          >
            <Flex className={"items-center"}>
              <Text className="text-center text-lime-400 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                {villagerAttestationCount === 2
                  ? `Thank You!`
                  : `Check out of ZuVillage Georgia`}
              </Text>
            </Flex>
            <Flex className={"items-center"}>
              {villagerAttestationCount !== 2 && (
                <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                  Are you sure you want to check out?
                  <br />
                  This proccess is irreversible.
                </Text>
              )}
              {villagerAttestationCount === 2 && (
                <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                  For being a cherished member of ZuVillage Georgia.
                </Text>
              )}
            </Flex>
          </CardHeader>
          <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
          <Box
            gap={6}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"column"}
            className="px-6 py-4 sm:px-[60px] w-full"
          >
            {checkInDate && (
              <Flex className={"items-center"}>
                <Text className="text-center text-white text-slate-50 text-base font-normal leading-snug">
                  Checked-in at:
                  <br />
                  {checkInDate}
                </Text>
              </Flex>
            )}
            {checkOutDate && (
              <Flex className={"items-center"}>
                <Text className="text-center text-white text-slate-50 text-base font-normal leading-snug">
                  Checked-out at:
                  <br />
                  {checkOutDate}
                </Text>
              </Flex>
            )}
            {!checkInDate && (
              <Flex className={"items-center"}>
                <Text className="text-center text-white text-slate-50 text-base font-normal leading-snug">
                  Fetching check-in data...
                </Text>
              </Flex>
            )}
            {villagerAttestationCount !== 2 && checkInDate && eventTime && (
              <Flex className={"items-center"}>
                <Text className="text-center text-white text-slate-50 text-base font-normal leading-snug">
                  You are with us for:
                  <br />
                  {eventTime[0]} days {eventTime[1]} hours {eventTime[2]}{" "}
                  minutes
                </Text>
              </Flex>
            )}
            {villagerAttestationCount === 2 && eventTime && (
              <Flex className={"items-center"}>
                <Text className="text-center text-white text-slate-50 text-base font-normal leading-snug">
                  You stayed with us for:
                  <br />
                  {eventTime[0]} days {eventTime[1]} hours {eventTime[2]}{" "}
                  minutes
                </Text>
              </Flex>
            )}
          </Box>
          {villagerAttestationCount === 1 && (
            <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
          )}
          {villagerAttestationCount === 1 && (
            <Box
              gap={6}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              flexDirection={"column"}
              className="px-6 py-4 sm:px-[60px] w-full"
            >
              <Button
                className="w-full px-6 py-4 bg-[#ef4343] text-white rounded-lg"
                _hover={{ bg: "#ef4343" }}
                _active={{ bg: "#ef4343" }}
                onClick={onOpen}
              >
                Confirm
              </Button>
            </Box>
          )}
        </Card>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={"#ef4343"} mx={{ base: 8, md: 0 }}>
          <ModalHeader>CHECK OUT</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontWeight={500}>
            I&apos;m checking out of ZuVillage Georgia.
            <br />
            I&apos;m aware that this action is irreversible.
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              textColor={"white"}
              bg={"#161617"}
              _hover={{ bg: "#161617" }}
              _active={{ bg: "#161617" }}
              spinner={<BeatLoader size={8} color="white" />}
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                handleAttest();
              }}
            >
              Check Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <TheFooterNavbar />
    </Flex>
  );
};
