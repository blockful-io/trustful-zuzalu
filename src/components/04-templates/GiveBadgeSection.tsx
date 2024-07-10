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
  Textarea,
} from "@chakra-ui/react";
import {
  isAddress,
  encodeAbiParameters,
  parseAbiParameters,
  type TransactionReceipt,
} from "viem";
import { useAccount } from "wagmi";

import {
  BadgeDetailsNavigation,
  CommentIcon,
  TheHeader,
  QrCodeIcon,
  UserIcon,
  HandHeartIcon,
  HeartIcon,
  TheFooterNavbar,
  ArrowIcon,
  ArrowIconVariant,
} from "@/components/01-atoms";
import { QRCode } from "@/components/03-organisms";
import { useNotify, useWindowSize } from "@/hooks";
import {
  ZUVILLAGE_BADGE_TITLES,
  ZUVILLAGE_SCHEMAS,
} from "@/lib/client/constants";
import type { BadgeTitle } from "@/lib/client/constants";
import { QRCodeContext } from "@/lib/context/QRCodeContext";
import { EthereumAddress } from "@/lib/shared/types";
import { getEllipsedAddress } from "@/utils/formatters";

import {
  submitAttest,
  type AttestationRequestData,
} from "../../lib/service/attest";

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
    setQRCodeisOpen,
    action,
    handleActionChange,
    addressStep,
    setAddressStep,
    badgeInputAddress,
    setBadgeInputAddress,
  } = useContext(QRCodeContext);

  const [inputAddress, setInputAddress] = useState<string>();
  const [inputBadge, setInputBadge] = useState<BadgeTitle>();
  const [commentBadge, setCommentBadge] = useState<string>();
  const [transactionReceipt, setTrasactionReceipt] =
    useState<TransactionReceipt>();

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

  // Get the current badge selected and move to state
  const handleBadgeSelectChange = (event: any) => {
    ZUVILLAGE_BADGE_TITLES.filter((badge) => {
      if (badge.title === event.target.value) {
        setInputBadge(badge);
      }
    });
  };

  // Get the current comment and move to state
  const handleCommentSelectChange = (event: any) => {
    setCommentBadge(event.target.value);
  };

  // Changes the continue arrow color based on the status of a valid input address
  const iconColor =
    inputAddress && isAddress(inputAddress)
      ? "text-[#FFFFFF]"
      : "text-[#F5FFFFB2]";
  const iconBg =
    inputAddress && isAddress(inputAddress) ? "bg-[#B1EF42B2]" : "bg-[#37383A]";

  // Submit attestation
  const handleAttest = async () => {
    if (!address) {
      notifyError({
        title: "No account connected",
        message: "Please connect your wallet.",
      });
      return;
    }

    if (!badgeInputAddress) {
      notifyError({
        title: "Invalid Ethereum Address",
        message: "Please provide a valid Ethereum address.",
      });
      return;
    }

    if (!inputBadge) {
      notifyError({
        title: "Invalid Badge",
        message: "Please select a badge to give.",
      });
      return;
    }

    let encodeParam = "";
    let encodeArgs: string[] = [];
    if (inputBadge.uid === ZUVILLAGE_SCHEMAS[0].uid) {
      encodeParam = ZUVILLAGE_SCHEMAS[0].data;
      encodeArgs = ["Manager"];
    } else if (inputBadge.uid === ZUVILLAGE_SCHEMAS[1].uid) {
      encodeParam = ZUVILLAGE_SCHEMAS[1].data;
      encodeArgs = ["Check-in"];
    } else if (inputBadge.uid === ZUVILLAGE_SCHEMAS[2].uid) {
      encodeParam = ZUVILLAGE_SCHEMAS[2].data;
      encodeArgs = [inputBadge.title, commentBadge ?? ""];
    } else {
      notifyError({
        title: "Invalid Badge",
        message: "Unexistent or invalid badge selected.",
      });
      return;
    }

    const data = encodeAbiParameters(parseAbiParameters(encodeParam), [
      encodeArgs,
    ]);

    const attestationRequestData: AttestationRequestData = {
      recipient: badgeInputAddress.address, //Temporary hardcoded
      expirationTime: BigInt(0),
      revocable: inputBadge.revocable,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: data,
      value: BigInt(0),
    };

    const response = await submitAttest(
      address,
      inputBadge.uid,
      attestationRequestData,
    );

    if (response instanceof Error) {
      notifyError({
        title: "Invalid Badge",
        message: response.message,
      });
      return;
    }

    setTrasactionReceipt(response);
    notifySuccess({
      title: "Success",
      message: "Badge sent at transaction: " + response.transactionHash,
    });
    return;
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
                        value={inputAddress}
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
                  <Flex
                    gap={4}
                    color="white"
                    className="w-full justify-between items-center"
                  >
                    <Text className="text-slate-50 opacity-80 text-base font-normal font-['Inter'] leading-snug border-none">
                      Continue
                    </Text>
                    <button
                      className={`flex rounded-full ${iconBg} justify-center items-center w-8 h-8`}
                      onClick={() =>
                        setAddressStep(
                          GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT,
                        )
                      }
                    >
                      <ArrowIcon
                        variant={ArrowIconVariant.RIGHT}
                        props={{ className: iconColor }}
                      />
                    </button>
                  </Flex>
                  <TheFooterNavbar />
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
                      onChange={handleBadgeSelectChange}
                    >
                      {ZUVILLAGE_BADGE_TITLES.map((badge, index) => (
                        <option key={index} value={badge.title}>
                          {badge.title}
                        </option>
                      ))}
                    </Select>
                  </Card>
                  {inputBadge?.allowComment && (
                    <Flex className="w-full mt-2 flex-col">
                      <Flex className="gap-4 pb-4 justify-start items-center">
                        <CommentIcon />
                        <Textarea
                          className="text-slate-50 text-base font-normal font-['Inter'] leading-snug border-none"
                          placeholder="Add a comment if needed..."
                          _placeholder={{
                            className: "text-slate-50 opacity-30",
                          }}
                          focusBorderColor={"#F5FFFF1A"}
                          onChange={handleCommentSelectChange}
                          resize="vertical"
                        />
                      </Flex>
                      <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                    </Flex>
                  )}
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
