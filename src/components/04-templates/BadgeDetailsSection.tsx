import { useState } from "react";

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
} from "@/components/01-atoms";
import { useNotify } from "@/hooks";
import { ZUVILLAGE_SCHEMAS } from "@/lib/client/constants";
import { useBadge } from "@/lib/context/BadgeContext";
import { getEllipsedAddress } from "@/utils/formatters";

import {
  submitAttest,
  type AttestationRequestData,
} from "../../lib/service/attest";

export const BadgeDetailsSection = () => {
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [loadingDeny, setLoadingDeny] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const { notifyError } = useNotify();
  const { selectedBadge } = useBadge();
  const { address } = useAccount();
  const toast = useToast();

  if (!selectedBadge) {
    return <div>Badge não encontrado.</div>;
  }

  // Submit attestation
  const handleAttest = async (isConfirm: boolean) => {
    if (!address) {
      setLoadingConfirm(false);
      setLoadingDeny(false);
      notifyError({
        title: "No account connected",
        message: "Please connect your wallet.",
      });
      return;
    }
    const data = encodeAbiParameters(
      parseAbiParameters(ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.data),
      [isConfirm],
    );
    const attestationRequestData: AttestationRequestData = {
      recipient: selectedBadge.attester as `0x${string}`,
      expirationTime: BigInt(0),
      revocable: true,
      refUID: selectedBadge.id as `0x${string}`,
      data: data,
      value: BigInt(0),
    };

    const response = await submitAttest(
      address,
      ZUVILLAGE_SCHEMAS.ATTEST_RESPONSE.uid,
      attestationRequestData,
    );

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

    // Set confirmed to true on successful response
    setConfirmed(isConfirm);

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

    setLoadingConfirm(false);
    setLoadingDeny(false);
    return;
  };
  const badgeStatus =
    confirmed === null && selectedBadge.status === null
      ? BadgeStatus.PENDING
      : confirmed === true
        ? BadgeStatus.CONFIRMED
        : confirmed === false
          ? BadgeStatus.REJECTED
          : selectedBadge.status;

  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="100px">
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
              <Text className="text-slate-50 text-sm font-normal leading-tight">
                {new Date(selectedBadge.timeCreated * 1000).toLocaleString()}
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
              <Flex flexDirection={"column"} gap={2} justifyContent={"center"}>
                <Text className="text-slate-50 text-sm font-medium  leading-none">
                  Issued by
                </Text>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  {getEllipsedAddress(selectedBadge.attester as `0x${string}`)}
                </Text>
              </Flex>
            </Flex>
            <Divider className="border-slate-50 opacity-10 w-full" />
            <Flex className="w-full flex-row p-4" gap={4}>
              <Avatar />
              <Flex flexDirection={"column"} gap={2} justifyContent={"center"}>
                <Text className="text-slate-50 text-sm font-medium  leading-none">
                  Receiver
                </Text>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  {getEllipsedAddress(selectedBadge.recipient as `0x${string}`)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
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
        <Card
          background={"#F5FFFF0D"}
          className="w-full rounded-lg border border-[#F5FFFF14] border-opacity-[8]"
        >
          <Flex flexDirection={"column"} gap={2} p={4}>
            <Text className="flex text-slate-50 text-sm font-medium  leading-none">
              Attestation
            </Text>
            <Text className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight">
              {getEllipsedAddress(selectedBadge.id as `0x${string}`)}
            </Text>
          </Flex>
          <Flex flexDirection={"column"} gap={2} p={4}>
            <Text className="flex text-slate-50 text-sm font-medium  leading-none">
              Transaction
            </Text>
            <Text className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight">
              {getEllipsedAddress(selectedBadge.txid as `0x${string}`)}
            </Text>
          </Flex>
          <Flex flexDirection={"column"} gap={2} p={4}>
            <Text className="flex text-slate-50 text-sm font-medium  leading-none">
              Scheme
            </Text>
            <Text className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight">
              #{selectedBadge.schema.index}
            </Text>
          </Flex>
        </Card>
      </Box>
      {selectedBadge.schema.id === ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid &&
      confirmed === null &&
      selectedBadge.status === BadgeStatus.PENDING ? (
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
    </Flex>
  );
};
