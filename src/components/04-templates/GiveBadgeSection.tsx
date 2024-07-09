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
import { ethers } from "ethers";
import { isAddress } from "viem";

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
import { useWindowSize } from "@/hooks";

import { submitAttest } from "../../lib/service/attest";
import { QRCodeContext } from "@/lib/context/QRCodeContext";
import { EthereumAddress } from "@/lib/shared/types";

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
  useEffect(() => {
    return () => {
      handleActionChange(GiveBadgeAction.ADDRESS);
      setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
    };
  }, []);

  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      setBadgeInputAddress(new EthereumAddress(inputAddress));
    }
  }, [inputAddress]);

  let badgeInput: string;
  if (badgeInputAddress !== null && isAddress(badgeInputAddress.address)) {
    badgeInput = badgeInputAddress.address;
  }

  const handleAttest = async () => {
    const schema =
      "0xd130b9591f22bb9653f125ed00ff2d7d88b41d64acfd962365b42fe720c295aa"; //Temporary hardcoded

    const abiCoder = new ethers.AbiCoder();

    const encodedData = abiCoder.encode(["string"], ["check-in"]);
    console.log("encodedData", encodedData);
    //

    const attestationRequestData = {
      recipient: "0x07231e0fd9F668d4aaFaE7A5D5f432B8E6e4Fe51" as `0x${string}`, //Temporary hardcoded
      expirationTime: BigInt(0),
      revocable: true,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
      data: "0x" as `0x${string}`,
      value: BigInt(0),
    };

    // const configurations = {
    //   walletClient: {},
    //   chain: 10,
    // };

    try {
      const transactionReceipt = await submitAttest(
        schema,
        attestationRequestData.recipient,
        attestationRequestData.expirationTime,
        attestationRequestData.revocable,
        attestationRequestData.refUID,
        attestationRequestData.data,
        attestationRequestData.value,
        //configurations,
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
                            crazy_monkey.eth
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
                            my_user.eth
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                  <Card
                    background={"#F5FFFF0D"}
                    className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
                  >
                    <Text className="flex">Badge</Text>
                    <Select placeholder="Select option" className="flex">
                      <option>ok</option>
                      <option>o2</option>
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
                    onClick={() =>
                      handleAttest();
                      setAddressStep(GiveBadgeStepAddress.CONFIRMATION)
                    }
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
