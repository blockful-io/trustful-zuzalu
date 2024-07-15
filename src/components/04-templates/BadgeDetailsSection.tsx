import { useContext, useEffect, useState } from "react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Text,
  Icon,
  Link,
  Divider,
  Textarea,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount } from "wagmi";

import {
  BadgeDetailsNavigation,
  TheFooterNavbar,
  BadgeStatus,
  BadgeTagIcon,
  HeartIcon,
  TheHeader,
  CopyToClipboardButton,
} from "@/components/01-atoms";
import { useNotify } from "@/hooks";
import { ZUVILLAGE_SCHEMAS } from "@/lib/client/constants";
import { useBadge } from "@/lib/context/BadgeContext";
import { WalletContext } from "@/lib/context/WalletContext";
import { getEllipsedAddress } from "@/utils/formatters";

import {
  submitAttest,
  type AttestationRequestData,
} from "../../lib/service/attest";
import { revoke } from "../../lib/service/revoke";

export const BadgeDetailsSection = () => {
  const { address } = useAccount();
  const { selectedBadge } = useBadge();
  const toast = useToast();
  const { notifyError } = useNotify();
  const { push } = useRouter();
  const { setSelectedBadge } = useBadge();

  const { villagerAttestationCount } = useContext(WalletContext);

  useEffect(() => {
    if (villagerAttestationCount === 0) {
      notifyError({
        title: "You have not checked in",
        message: "Please check-in first.",
      });
      push("/pre-checkin");
    }
    if (selectedBadge) {
      setBadgeStatus(selectedBadge?.status);
      setAttestResponseId(selectedBadge?.responseId);
    } else {
      push("/my-badges");
    }
  }, [villagerAttestationCount]);

  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [loadingDeny, setLoadingDeny] = useState<boolean>(false);
  const [badgeStatus, setBadgeStatus] = useState<BadgeStatus>(
    BadgeStatus.PENDING,
  );
  const [attestResponseId, setAttestResponseId] = useState<string>();

  const canProcessAttestation = () => {
    if (!selectedBadge) {
      setLoadingConfirm(false);
      setLoadingDeny(false);
      notifyError({
        title: "No badge selected",
        message: "Please select a badge.",
      });

      return false;
    }

    if (!address) {
      setLoadingConfirm(false);
      setLoadingDeny(false);
      notifyError({
        title: "No account connected",
        message: "Please connect your wallet.",
      });
      return false;
    }
    return true;
  };

  const processAttestationResponse = async (
    response: any,
    isConfirm: boolean | null,
  ) => {
    if (response instanceof Error) {
      setLoadingConfirm(false);
      setLoadingDeny(false);
      notifyError({
        title: "Transaction Rejected",
        message: response.message,
      });
      return;
    }

    if (response.status !== "success") {
      setLoadingConfirm(false);
      setLoadingDeny(false);
      notifyError({
        title: "Transaction Rejected",
        message: "Contract execution reverted.",
      });
      return;
    }
    if (selectedBadge) {
      selectedBadge.revoked = true;
      setSelectedBadge(selectedBadge);
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

    if (isConfirm === null) {
      setBadgeStatus(BadgeStatus.PENDING);
    } else {
      if (!(response instanceof Error)) {
        if (isConfirm) {
          setBadgeStatus(BadgeStatus.CONFIRMED);
        } else {
          setBadgeStatus(BadgeStatus.REJECTED);
        }
        setAttestResponseId(response.logs[0].data);
      }
    }
    setLoadingConfirm(false);
    setLoadingDeny(false);

    return;
  };

  // Submit attestation
  const handleAttest = async (isConfirm: boolean) => {
    if (!canProcessAttestation()) return;

    const data = encodeAbiParameters(
      parseAbiParameters(ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.data),
      [isConfirm],
    );
    const attestationRequestData: AttestationRequestData = {
      recipient: selectedBadge?.attester as `0x${string}`,
      expirationTime: BigInt(0),
      revocable: true,
      refUID: selectedBadge?.id as `0x${string}`,
      data: data,
      value: BigInt(0),
    };

    const response = await submitAttest(
      address as `0x${string}`,
      ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid,
      attestationRequestData,
    );
    processAttestationResponse(response, isConfirm);
    //fetchAttestationResponse();
  };

  // Submit revoke
  const handleRevoke = async () => {
    if (!canProcessAttestation()) return;
    const response = await revoke(
      address as `0x${string}`,
      ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid,
      attestResponseId as `0x${string}`,
      0n,
    );
    processAttestationResponse(response, null);
  };

  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="100px">
      {villagerAttestationCount !== null && selectedBadge !== null ? (
        <>
          <TheHeader />
          <BadgeDetailsNavigation isDetail={true} />
          <Box
            flex={0}
            as="main"
            px={{ base: 6, sm: "60px" }}
            py={{ base: 2, sm: "20px" }}
            className="justify-center flex items-center flex-col"
            gap={6}
          >
            <Flex gap={4} className="w-full h-full items-top">
              <Flex
                className="flex items-center justify-center"
                py="6px"
                px={"20px"}
              >
                <HeartIcon className="w-8 h-8 opacity-50 text-slate-50" />
              </Flex>
              <Flex flexDirection={"column"} className="w-full">
                <Box>
                  <Text className="text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                    {selectedBadge.title}
                  </Text>
                </Box>
                <Flex gap={2} className="items-center">
                  <Text className="text-slate-50 text-sm font-normal  leading-tight">
                    {new Date(
                      selectedBadge.timeCreated * 1000,
                    ).toLocaleString()}
                  </Text>
                  <BadgeTagIcon status={badgeStatus} />
                </Flex>
              </Flex>
            </Flex>
            <Card
              background={"#F5FFFF0D"}
              className="w-full border border-[#F5FFFF14] border-opacity-[8]"
            >
              <Flex flexDirection={"column"} className="w-full items-center">
                <Flex className="w-full flex-row p-4" gap={4}>
                  <Avatar />
                  <Flex
                    flexDirection={"column"}
                    gap={2}
                    justifyContent={"center"}
                  >
                    <Text className="text-slate-50 text-sm font-medium  leading-none">
                      Issued by
                    </Text>
                    <Text className="text-slate-50 opacity-70 text-sm font-normal  leading-tight">
                      {getEllipsedAddress(
                        selectedBadge.attester as `0x${string}`,
                      )}
                    </Text>
                  </Flex>
                </Flex>
                <Divider className="border-slate-50 opacity-10 w-full" />
                <Flex className="w-full flex-row p-4" gap={4}>
                  <Avatar />
                  <Flex
                    flexDirection={"column"}
                    gap={2}
                    justifyContent={"center"}
                  >
                    <Text className="text-slate-50 text-sm font-medium  leading-none">
                      Receiver
                    </Text>
                    <Text className="text-slate-50 opacity-70 text-sm font-normal  leading-tight">
                      {getEllipsedAddress(
                        selectedBadge.recipient as `0x${string}`,
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
            {selectedBadge.comment && (
              <Card
                background={"#F5FFFF0D"}
                className="w-full rounded-lg border border-[#F5FFFF14] border-opacity-[8]"
              >
                <Flex flexDirection={"column"} gap={2} p={4}>
                  <Text className="flex text-slate-50 text-sm font-medium leading-none">
                    Comment
                  </Text>
                  <Textarea
                    color="white"
                    className="px-0 opacity-70 disabled text-slate-50 text-sm font-normal border-none leading-tight"
                    readOnly={true}
                    _readOnly={{
                      opacity: 0.7,
                      cursor: "not-allowed",
                    }}
                    disabled={true}
                    value={selectedBadge.comment}
                    rows={selectedBadge.comment.length > 50 ? 3 : 1}
                    minH="unset"
                    resize="none"
                  ></Textarea>
                </Flex>
              </Card>
            )}
            <Card
              background={"#F5FFFF0D"}
              className="w-full rounded-lg border border-[#F5FFFF14] border-opacity-[8]"
            >
              <Flex flexDirection={"column"} gap={2} p={4}>
                <Text className="flex text-slate-50 text-sm font-medium  leading-none">
                  Attestation
                </Text>
                <Flex color="white" className="gap-2">
                  <Text className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    {getEllipsedAddress(selectedBadge.id as `0x${string}`)}
                  </Text>
                  <CopyToClipboardButton
                    label={selectedBadge.id}
                    isUserAddress={false}
                  />
                </Flex>
              </Flex>
              <Flex flexDirection={"column"} gap={2} p={4}>
                <Text className="flex text-slate-50 text-sm font-medium  leading-none">
                  Transaction
                </Text>
                <Flex color="white" className="gap-2">
                  <Text className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    {getEllipsedAddress(selectedBadge.txid as `0x${string}`)}
                  </Text>
                  <CopyToClipboardButton
                    label={selectedBadge.txid}
                    isUserAddress={false}
                  />
                </Flex>
              </Flex>
              <Flex flexDirection={"column"} gap={2} p={4}>
                <Text className="flex text-slate-50 text-sm font-medium  leading-none">
                  Scheme
                </Text>
                <Flex color="white" className="gap-2">
                  <Text className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    {getEllipsedAddress(
                      selectedBadge.schema.id as `0x${string}`,
                    )}
                  </Text>
                  <CopyToClipboardButton
                    label={selectedBadge.schema.id}
                    isUserAddress={false}
                  />
                </Flex>
              </Flex>
            </Card>
            {selectedBadge.schema.id == ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid &&
              badgeStatus !== BadgeStatus.PENDING && (
                <Button
                  className="w-full flex justify-center items-center bg-[#2d2525] gap-2 px-6 text-[#DB4C40] rounded-lg"
                  _hover={{ color: "#fff", bg: "#DB4C40" }}
                  _active={{ color: "#fff", bg: "#DB4C40" }}
                  bg="#F5FFFF0D"
                  isLoading={loadingDeny}
                  spinner={<BeatLoader size={8} color="white" />}
                  onClick={() => {
                    setLoadingDeny(true);
                    handleRevoke();
                  }}
                >
                  <CloseIcon className="w-[14px] h-[14px]" />
                  Revoke
                </Button>
              )}
          </Box>
          {selectedBadge.schema.id === ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid &&
          badgeStatus === BadgeStatus.PENDING ? (
            <Box
              as="footer"
              position="fixed"
              bottom={0}
              zIndex={0}
              textAlign={"center"}
              className="px-6 py-4 bg-[#161617] w-full flex group border-t border-[#F5FFFF14] border-opacity-[8] gap-3"
            >
              <Button
                className="w-full flex justify-center items-center gap-2 px-6 bg-lime-200 bg-opacity-10 text-[#B1EF42] rounded-lg"
                _hover={{ bg: "#B1EF42", color: "#161617" }}
                _active={{ bg: "#B1EF42", color: "#161617" }}
                isLoading={loadingDeny}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={() => {
                  setLoadingDeny(true);
                  handleAttest(false);
                }}
              >
                <CloseIcon className="w-[14px] h-[14px]" />
                Deny
              </Button>
              <Button
                className="w-full justify-center items-center gap-2 px-6 bg-[#B1EF42] text-[#161617] rounded-lg"
                _hover={{ bg: "#B1EF42" }}
                _active={{ bg: "#B1EF42" }}
                isLoading={loadingConfirm}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={() => {
                  setLoadingConfirm(true);
                  handleAttest(true);
                }}
              >
                <CheckIcon className="w-[16px] h-[16px]" />
                Confirm
              </Button>
            </Box>
          ) : (
            <TheFooterNavbar />
          )}
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
