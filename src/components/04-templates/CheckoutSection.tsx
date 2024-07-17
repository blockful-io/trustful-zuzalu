/* eslint-disable react-hooks/exhaustive-deps */
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
import { ZUVILLAGE_SCHEMAS, ROLES } from "@/lib/client/constants";
import { VILLAGER_QUERY } from "@/lib/client/schemaQueries";
import { WalletContext } from "@/lib/context/WalletContext";
import {
  submitAttest,
  type AttestationRequestData,
} from "@/lib/service/attest";
import { fetchEASData } from "@/lib/service/fetchEASData";
import { hasRole } from "@/lib/service/hasRole";
import {
  formatTimeDifference,
  getEllipsedAddress,
  getReadableData,
} from "@/utils/formatters";

export const CheckoutSection = () => {
  const { address } = useAccount();
  const toast = useToast();
  const { push } = useRouter();
  const { notifyError } = useNotify();

  const { villagerAttestationCount, setVillagerAttestationCount } =
    useContext(WalletContext);

  useEffect(() => {
    if (villagerAttestationCount === 0) push("/pre-checkin");
  }, [villagerAttestationCount]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState<number | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<number | null>(null);
  const [eventTime, setEventTime] = useState<string[] | null>(null);
  const [checkInTxId, setCheckInTxId] = useState<`0x${string}` | null>(null);

  //Ja sei se o usuario tem chacking, ou checking e checkout
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

    if (!checkInTxId) {
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
      refUID: checkInTxId,
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

    if (response.status !== "success") {
      setLoading(false);
      notifyError({
        title: "Transaction Rejected",
        message: "Contract execution reverted.",
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
              Check-out at tx:{" "}
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

    //unixtimestamp in seconds
    const now = Math.floor(Date.now() / 1000);

    if (checkInDate) {
      setCheckOutDate(now);
      setEventTime(formatTimeDifference(checkInDate, now));
      console.log("eventTime", eventTime);
    }
    handleThankYou();
    setLoading(false);
    onClose();
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
      orderBy: [
        {
          timeCreated: "asc",
        },
      ],
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

    // If the user has not checked in, redirect to pre-checkin page
    if (response.data.data.attestations.length === 0) {
      if (address) {
        const isRoot = await hasRole(ROLES.ROOT, address);
        if (isRoot) {
          setVillagerAttestationCount(2);
          return;
        } else {
          notifyError({
            title: "You have not checked in",
            message: "Please check-in first.",
          });
          push("/pre-checkin");
          return;
        }
      }
    }

    // Loop through the attestations to find the check-in and check-out timestamps
    for (let i = 0; i < response.data.data.attestations.length; i++) {}

    // If the user has checked in, the attestation will return a length of 1
    const id = response.data.data.attestations[0].id;
    const timeCreated = response.data.data.attestations[0].timeCreated;
    setCheckInTxId(id);
    setCheckInDate(timeCreated);

    // If the user has checked out, the attestation will return a length of 2
    if (response.data.data.attestations.length > 1) {
      const timeEnded = response.data.data.attestations[1].timeCreated;
      setCheckOutDate(timeEnded);
      setEventTime(
        formatTimeDifference(Number(timeCreated), Number(timeEnded)),
      );
    } else {
      setEventTime(formatTimeDifference(Number(timeCreated)));
    }
  };

  console.log("CheckinDate", checkInDate);

  console.log("CheckoutData:", checkOutDate);
  console.log(
    "CheckoutDataConvertedToDats:",
    getReadableData(Number(checkOutDate)),
  );

  // Subgraph may take some time to update, so we force a check straight to the blockchain
  // to see if the user role has been updated, changing the view accordingly
  const handleThankYou = async () => {
    if (!address) {
      setLoading(false);
      notifyError({
        title: "No account connected",
        message: "Please connect your wallet.",
      });
      return;
    }
    const isRoot = await hasRole(ROLES.ROOT, address);
    const isVillager = await hasRole(ROLES.VILLAGER, address);
    if (isRoot || !isVillager) {
      setVillagerAttestationCount(2);
      return;
    } else {
      notifyError({
        title: "You have not checked in",
        message: "Please check-in first.",
      });
      push("/pre-checkin");
      return;
    }
  };

  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      {villagerAttestationCount !== null ? (
        <>
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
              >
                <Flex className={"items-center"}>
                  {villagerAttestationCount === 1 && (
                    <Text className="text-center text-lime-400 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                      Check out of
                      <br />
                      ZuVillage Georgia
                    </Text>
                  )}
                  {villagerAttestationCount === 2 && (
                    <Text className="text-center text-lime-400 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                      Thank You!
                    </Text>
                  )}
                </Flex>
                <Flex className={"items-center"}>
                  {villagerAttestationCount === 1 && (
                    <Text className="text-center py-4 text-slate-50 text-base font-normal leading-snug">
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
                    <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                      Checked-in at:
                      <br />
                      {getReadableData(Number(checkInDate))}
                    </Text>
                  </Flex>
                )}
                {checkOutDate && (
                  <Flex className={"items-center"}>
                    <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                      Checked-out at:
                      <br />
                      {getReadableData(Number(checkOutDate))}
                    </Text>
                  </Flex>
                )}
                {!checkInDate && (
                  <Flex className={"items-center"}>
                    <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                      Fetching check-in data...
                    </Text>
                  </Flex>
                )}
                {villagerAttestationCount !== 2 && checkInDate && eventTime && (
                  <Flex className={"items-center"}>
                    <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                      You are with us for:
                      <br />
                      {eventTime[0]} days {eventTime[1]} hours {eventTime[2]}{" "}
                      minutes
                    </Text>
                  </Flex>
                )}
                {villagerAttestationCount === 2 &&
                  checkInDate &&
                  checkOutDate &&
                  eventTime && (
                    <Flex className={"items-center"}>
                      <Text className="text-center text-slate-50 text-base font-normal leading-snug">
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
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
