/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import { isAddress, zeroAddress } from "viem";
import { getBlock } from "viem/actions";
import {
  useAccount,
  useClient,
  usePublicClient,
  useSendTransaction,
  useWalletClient,
} from "wagmi";

import {
  BadgeDetailsNavigation,
  CommentIcon,
  TheHeader,
  TheFooterBadgeDetails,
  QrCodeIcon,
  UserIcon,
  HandHeartIcon,
  HeartIcon,
} from "@/components/01-atoms";
import { QRCode } from "@/components/03-organisms";
import { useNotify, useWindowSize } from "@/hooks";
import { ZUVILLAGE_BADGE_TITLES } from "@/lib/client/constants";
import type { BadgeTitles } from "@/lib/client/constants";
import { QRCodeContext } from "@/lib/context/QRCodeContext";
import { EthereumAddress } from "@/lib/shared/types";
import { publicClient } from "@/lib/wallet/client";
import { getEllipsedAddress } from "@/utils/formatters";

import { submitAttest } from "../../lib/service/attest";

export enum GiveBadgeAction {
  ADDRESS = "ADDRESS",
  QR_CODE = "QR_CODE",
}

export enum GiveBadgeStepAddress {
  INSERT_ADDRESS = "INSERT_ADDRESS",
  INSERT_BADGE_AND_COMMENT = "INSERT_BADGE_AND_COMMENT",
  CONFIRMATION = "CONFIRMATION",
}

export const GiveBadgeSection = () => {
  const { isMobile } = useWindowSize();
  const { address } = useAccount();
  const { notifyError, notifySuccess } = useNotify();
  const {
    action,
    addressStep,
    handleActionChange,
    setAddressStep,
    badgeInputAddress,
    setQRCodeisOpen,
    setBadgeInputAddress,
  } = useContext(QRCodeContext);

  const [inputAddress, setInputAddress] = useState<string>();
  const [selectedBadge, setSelectedBadge] = useState<BadgeTitles>();

  // Resets the context when the component is mounted for the first time
  useEffect(() => {
    return () => {
      handleActionChange(GiveBadgeAction.ADDRESS);
      setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
      setBadgeInputAddress(null);
    };
  }, []);

  // Updates the badgeInputAddress when the inputAddress changes
  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      setBadgeInputAddress(new EthereumAddress(inputAddress));
    } else if (inputAddress != null) {
      notifyError({
        title: "Invalid Ethereum Address",
        message: "Ethereum address provided is not on correct format.",
      });
    }
  }, [inputAddress]);

  let badgeInput: string;
  if (badgeInputAddress !== null && isAddress(badgeInputAddress.address)) {
    badgeInput = badgeInputAddress.address;
  }

  const { sendTransaction } = useSendTransaction();
  // const { data: receipt, isLoading } = useWaitForTransactionReceipt({
  //   hash: data,
  // });

  const handleSelectChange = (event: any) => {
    ZUVILLAGE_BADGE_TITLES.filter((badge) => {
      if (badge.title === event.target.value) {
        setSelectedBadge(badge);
      }
    });
  };

  const handleTransfer = () => {
    const receiver = "0x4200000000000000000000000000000000000021";
    const amount = BigInt(0);
    if (receiver.length === 0 || !isAddress(receiver)) {
      return notifyError({
        title: "Error:",
        message: "The receiver address is not set!",
      });
    }

    // if (parseFloat(amount) <= 0) {
    //   return notifyError({
    //     title: "Error:",
    //     message: "The amount to send must be greater than 0.",
    //   });
    // }

    sendTransaction({
      to: receiver,
      value: amount,
      data: "0xf17325e70000000000000000000000000000000000000000000000000000000000000020d130b9591f22bb9653f125ed00ff2d7d88b41d64acfd962365b42fe720c295aa000000000000000000000000000000000000000000000000000000000000004000000000000000000000000007231e0fd9f668d4aafae7a5d5f432b8e6e4fe5100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    });
  };

  const handleAttest = async () => {
    console.log("blockNUmber PUBLIC CLIENT", publicClient);
    const blockNumber = await getBlock(publicClient, { blockTag: "latest" });
    console.log("bLOCKnUMBER", blockNumber);

    const schema =
      "0xd130b9591f22bb9653f125ed00ff2d7d88b41d64acfd962365b42fe720c295aa"; //Temporary hardcoded

    const attestationRequestData = {
      recipient: "0x07231e0fd9F668d4aaFaE7A5D5f432B8E6e4Fe51" as `0x${string}`, //Temporary hardcoded
      expirationTime: BigInt(0),
      revocable: true,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
      data: "0x" as `0x${string}`,
      value: BigInt(0),
    };

    try {
      const transactionReceipt = await submitAttest(
        schema,
        attestationRequestData.recipient,
        attestationRequestData.expirationTime,
        attestationRequestData.revocable,
        attestationRequestData.refUID,
        attestationRequestData.data,
        attestationRequestData.value,
        // walletClient,
        // publicClient,
      );
      console.log("Transaction receipt:", transactionReceipt);
    } catch (error) {
      console.error("Failed to submit attest:", error);
    }
  };

  const renderStepContent = (action: GiveBadgeAction) => {
    switch (action) {
      case GiveBadgeAction.ADDRESS:
        switch (addressStep) {
          case GiveBadgeStepAddress.INSERT_ADDRESS:
            return (
              <>
                <TheHeader />
                <Box
                  as="main"
                  className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col w-full"
                  gap={8}
                >
                  <Text className="flex text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                    Let&apos;s give a badge to someone
                  </Text>
                  <Flex className="w-full flex-col">
                    <Flex className="gap-4 pb-4 justify-start items-center">
                      <UserIcon className="text-[#B1EF42]" />
                      <Input
                        className="text-slate-50 text-base font-normal font-['Inter'] leading-snug border-none"
                        placeholder="Insert address or ENS"
                        _placeholder={{ className: "text-slate-50 opacity-30" }}
                        focusBorderColor={"#F5FFFF1A"}
                        value={badgeInput}
                        onChange={(e) => setInputAddress(e.target.value)}
                      />
                      <QrCodeIcon
                        onClick={() => {
                          setQRCodeisOpen(true);
                          handleActionChange(GiveBadgeAction.QR_CODE);
                        }}
                      />
                    </Flex>
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                  </Flex>
                  <TheFooterBadgeDetails />
                </Box>
              </>
            );
          case GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT:
            return (
              <>
                <TheHeader />
                <BadgeDetailsNavigation />
                <Box
                  flex={1}
                  as="main"
                  className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col"
                  gap={4}
                >
                  <Card
                    background={"#F5FFFF0D"}
                    className="w-full border border-[#F5FFFF14] border-opacity-[8]"
                  >
                    <Flex
                      flexDirection={"column"}
                      className="w-full items-center"
                    >
                      <Flex className="w-full flex-row p-4" gap={4}>
                        <Avatar />
                        <Flex
                          flexDirection={"column"}
                          justifyContent={"center"}
                        >
                          <Text className="text-slate-50 text-sm font-medium font-['Inter'] leading-none">
                            Issued by
                          </Text>
                          <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                            {getEllipsedAddress(address)}
                          </Text>
                        </Flex>
                      </Flex>
                      <Divider className="border-slate-50 opacity-10 w-full" />
                      <Flex className="w-full flex-row p-4" gap={4}>
                        <Avatar />
                        <Flex
                          flexDirection={"column"}
                          justifyContent={"center"}
                        >
                          <Text className="text-slate-50 text-sm font-medium font-['Inter'] leading-none">
                            Receiver
                          </Text>
                          <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                            {getEllipsedAddress(badgeInputAddress?.address)}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                  <Card
                    background={"#F5FFFF0D"}
                    className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
                  >
                    <Text className="text-slate-50 mb-2 text-sm font-medium font-['Inter'] leading-none">
                      Select a Badge
                    </Text>
                    <Select
                      placeholder="Select option"
                      className="flex text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight"
                      color="white"
                      onChange={handleSelectChange}
                    >
                      {ZUVILLAGE_BADGE_TITLES.map((badge, index) => (
                        <option key={index} value={badge.title}>
                          {badge.title}
                        </option>
                      ))}
                    </Select>
                  </Card>
                  <Flex className="w-full flex-col">
                    <Flex className="gap-4 pb-4 justify-start items-center">
                      <CommentIcon />
                      <Input
                        className="text-slate-50 text-base font-normal font-['Inter'] leading-snug border-none"
                        placeholder="Add a comment if needed..."
                        _placeholder={{ className: "text-slate-50 opacity-30" }}
                        focusBorderColor={"#F5FFFF1A"}
                      />
                    </Flex>
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                  </Flex>
                </Box>
                <Box className="px-6 py-4 sm:px-[60px] w-full">
                  <Button
                    className="w-full px-6 py-4 bg-[#B1EF42] text-black rounded-lg"
                    onClick={() => {
                      handleAttest();
                      setAddressStep(GiveBadgeStepAddress.CONFIRMATION);
                    }}
                  >
                    Confirm
                  </Button>
                </Box>
              </>
            );
          case GiveBadgeStepAddress.CONFIRMATION:
            return (
              <>
                <TheHeader />
                <BadgeDetailsNavigation isFeedback={true} />
                <Box
                  flex={1}
                  as="main"
                  className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col"
                  gap={8}
                >
                  <Flex className="flex justify-center items-center px-1 py-1.5 bg-slate-50 bg-opacity-5 rounded-[100px]  w-[100px] h-[100px]">
                    <HandHeartIcon className="z-10 text-[#B1EF42]" />
                  </Flex>
                  <Flex>
                    <Text className="flex text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                      Badge has been given successfully!
                    </Text>
                  </Flex>
                  <Flex className="flex-col">
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                    <Flex className="py-4 gap-4 items-center">
                      <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                        Receiver
                      </Text>
                      <Flex gap={2}>
                        <Avatar className="w-5 h-5" />
                        <Text className="text-slate-50 text-sm font-normal font-['Inter'] leading-tight">
                          magic_stone1999.eth
                        </Text>
                      </Flex>
                    </Flex>
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                    <Flex className="py-4 gap-4 items-center">
                      <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                        Badge
                      </Text>
                      <Flex gap={2}>
                        <HeartIcon className="w-5 h-5 opacity-5" />
                        <Text className="text-slate-50 text-sm font-normal font-['Inter'] leading-tight">
                          ChangeMyMind
                        </Text>
                      </Flex>
                    </Flex>
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                    <Flex className="py-4 gap-4 items-center">
                      <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                        Comment
                      </Text>
                      <Flex gap={2}>
                        <Text className="text-slate-50 text-sm font-normal font-['Inter'] leading-tight">
                          Really cool person, changed my mind.
                        </Text>
                      </Flex>
                    </Flex>
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                  </Flex>
                </Box>
              </>
            );
        }
      case GiveBadgeAction.QR_CODE:
        return isMobile && <QRCode />;
    }
  };

  return (
    <Flex flexDirection="column" minHeight="100vh">
      {renderStepContent(action)}
    </Flex>
  );
};
