/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";

import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Input,
  Link,
  Select,
  Text,
  Textarea,
  Icon,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { isAddress, encodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount } from "wagmi";

import {
  BadgeDetailsNavigation,
  CommentIcon,
  TheHeader,
  UserIcon,
  HandHeartIcon,
  TheFooterNavbar,
  ArrowIcon,
  ArrowIconVariant,
  CopyToClipboardButton,
} from "@/components/01-atoms";
import { useNotify } from "@/hooks";
import {
  ZUVILLAGE_BADGE_TITLES,
  ZUVILLAGE_SCHEMAS,
  ROLES,
  type BadgeTitle,
} from "@/lib/client/constants";
import { GiveBadgeContext } from "@/lib/context/GiveBadgeContext";
import { WalletContext } from "@/lib/context/WalletContext";
import {
  submitAttest,
  type AttestationRequestData,
  hasRole,
} from "@/lib/service";
import { checkedOutVillagers } from "@/lib/service/checkedOutVillagers";
import { EthereumAddress } from "@/lib/shared/types";
import { getEllipsedAddress } from "@/utils/formatters";

export enum GiveBadgeStepAddress {
  INSERT_ADDRESS = "INSERT_ADDRESS",
  INSERT_BADGE_AND_COMMENT = "INSERT_BADGE_AND_COMMENT",
  CONFIRMATION = "CONFIRMATION",
}

export const GiveBadgeSection = () => {
  const { address } = useAccount();
  const toast = useToast();
  const { push } = useRouter();
  const { notifyError } = useNotify();
  const {
    addressStep,
    setAddressStep,
    badgeInputAddress,
    setBadgeInputAddress,
    inputBadgeTitleList,
  } = useContext(GiveBadgeContext);
  const { villagerAttestationCount } = useContext(WalletContext);

  useEffect(() => {
    if (villagerAttestationCount === 0) {
      notifyError({
        title: "You have not checked in",
        message: "Please check-in first.",
      });
      push("/pre-checkin");
    }
  }, [villagerAttestationCount]);

  const [inputAddress, setInputAddress] = useState<string>();
  const [inputBadge, setInputBadge] = useState<BadgeTitle>();
  const [commentBadge, setCommentBadge] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  // Resets the context when the component is mounted for the first time
  useEffect(() => {
    return () => {
      setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
      setBadgeInputAddress(null);
    };
  }, []);

  const searchParams = useSearchParams();
  const addressShared = searchParams.get("address");
  const param = useParams();

  // Checks if the shared-address is valid and sets it to the inputAddress
  useEffect(() => {
    if (
      addressShared &&
      isAddress(addressShared) &&
      param.slug[0] === "give-badge"
    ) {
      setInputAddress(addressShared);
    }
  }, [addressShared]);

  // Updates the badgeInputAddress when the inputAddress changes
  useEffect(() => {
    if (inputAddress && isAddress(inputAddress)) {
      setBadgeInputAddress(new EthereumAddress(inputAddress));
    }
  }, [inputAddress]);

  // Do not allow invalid Ethereum addresses to move into the next step
  const handleInputAddressChange = () => {
    if (!inputAddress || !isAddress(inputAddress)) {
      notifyError({
        title: "Field is empty",
        message: "Please provide a valid Ethereum address.",
      });
      return;
    }
    if (inputAddress && !isAddress(inputAddress)) {
      notifyError({
        title: "Invalid Ethereum Address",
        message: "Wrong Ethereum address format. Please try again.",
      });
    } else {
      setAddressStep(GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT);
    }
  };

  // Get the current badge selected and move to state
  const handleBadgeSelectChange = (event: any) => {
    ZUVILLAGE_BADGE_TITLES.filter((badge) => {
      if (badge.title === event.target.value) {
        setInputBadge(badge);
      } else {
        const customBadge: BadgeTitle = {
          title: event.target.value,
          uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
          allowComment: true,
          revocable: false,
          data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
          allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
        };
        setInputBadge(customBadge);
      }
    });
  };

  // Get the current comment and move to state
  // It also updates the textarea height based on the content
  const handleTextareaChange = (event: any) => {
    const textareaLineHeight = 22;
    const scrollHeight = event.target.scrollHeight - 16;

    const currentRows = Math.ceil(scrollHeight / textareaLineHeight);
    if (currentRows >= 2) {
      event.target.rows = currentRows;
    }

    setText(event.target.value);
    setCommentBadge(event.target.value);
  };

  // Changes the continue arrow color based on the status of a valid input address
  const iconColor =
    inputAddress && isAddress(inputAddress)
      ? "text-[#000000  ]"
      : "text-[#F5FFFFB2]";
  const iconBg =
    inputAddress && isAddress(inputAddress) ? "bg-[#B1EF42B2]" : "bg-[#37383A]";

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

    if (!badgeInputAddress) {
      setLoading(false);
      notifyError({
        title: "Invalid Ethereum Address",
        message: "Please provide a valid Ethereum address.",
      });
      return;
    }

    if (!inputBadge) {
      setLoading(false);
      notifyError({
        title: "Invalid Badge",
        message: "Please select a badge to give.",
      });
      return;
    }

    let encodeParam = "";
    let encodeArgs: string[] = [];
    if (inputBadge.uid === ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.uid) {
      encodeParam = ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.data;
      encodeArgs = ["Manager"];
      const isManager = await hasRole(ROLES.MANAGER, badgeInputAddress.address);
      if (isManager) {
        setLoading(false);
        notifyError({
          title: "Address is already a Manager",
          message: "Address already have this badge.",
        });
        return;
      }
    } else if (inputBadge.uid === ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid) {
      if (inputBadge.title === "Check-in") {
        encodeParam = ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.data;
        encodeArgs = ["Check-in"];
        const isVillager = await hasRole(
          ROLES.VILLAGER,
          badgeInputAddress.address,
        );
        if (isVillager) {
          setLoading(false);
          notifyError({
            title: "Address already checked-in",
            message: "Address already have this badge.",
          });
          return;
        }
      } else if (inputBadge.title === "Check-out") {
        encodeParam = ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.data;
        encodeArgs = ["Check-out"];
        const isCheckedOut = await checkedOutVillagers(
          badgeInputAddress.address,
        );
        if (isCheckedOut) {
          setLoading(false);
          notifyError({
            title: "Address already checked-out",
            message: "Address already have this badge.",
          });
          return;
        }
      }
    } else if (inputBadge.uid === ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid) {
      encodeParam = ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data;
      encodeArgs = [inputBadge.title, commentBadge ?? ""];
    } else {
      setLoading(false);
      notifyError({
        title: "Invalid Badge",
        message: "Unexistent or invalid badge selected.",
      });
      return;
    }

    const data = encodeAbiParameters(
      parseAbiParameters(encodeParam),
      encodeArgs,
    );

    const attestationRequestData: AttestationRequestData = {
      recipient: badgeInputAddress.address,
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

    setAddressStep(GiveBadgeStepAddress.CONFIRMATION);
    setLoading(false);
    setText("");
    setInputAddress("");

    return;
  };

  const renderStepContent = (addressStep: GiveBadgeStepAddress) => {
    switch (addressStep) {
      case GiveBadgeStepAddress.INSERT_ADDRESS:
        return (
          <>
            {villagerAttestationCount !== null ? (
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
                        className="text-slate-50 text-base font-normal leading-snug border-none"
                        placeholder="Insert address or ENS"
                        _placeholder={{
                          className: "text-slate-50 opacity-30",
                        }}
                        focusBorderColor={"#F5FFFF1A"}
                        value={inputAddress}
                        onChange={(e) => setInputAddress(e.target.value)}
                      />
                      <Flex className="w-8" color="white">
                        <CopyToClipboardButton
                          isUserAddress={false}
                          label={inputAddress}
                        />
                      </Flex>
                    </Flex>
                    <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                  </Flex>
                  <Flex
                    gap={4}
                    color="white"
                    className="w-full justify-between items-center"
                  >
                    <Text className="text-slate-50 opacity-80 text-base font-normal leading-snug border-none">
                      Continue
                    </Text>
                    <button
                      className={`flex rounded-full ${iconBg} justify-center items-center w-8 h-8`}
                      onClick={() => handleInputAddressChange()}
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
            ) : (
              <Box flex={1} className="flex justify-center items-center">
                <BeatLoader size={8} color="#B1EF42" />
              </Box>
            )}
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
                <Flex flexDirection={"column"} className="w-full items-center">
                  <Flex className="w-full flex-row p-4" gap={4}>
                    <Avatar />
                    <Flex
                      flexDirection={"column"}
                      gap={2}
                      justifyContent={"center"}
                    >
                      <Text className="text-slate-50 text-sm font-medium leading-none">
                        Issued by
                      </Text>
                      <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                        {getEllipsedAddress(address)}
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
                      <Text className="text-slate-50 text-sm font-medium leading-none">
                        Receiver
                      </Text>
                      <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                        {getEllipsedAddress(badgeInputAddress?.address)}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
              {inputBadgeTitleList && inputBadgeTitleList.length > 0 && (
                <>
                  <Card
                    background={"#F5FFFF0D"}
                    className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
                  >
                    <Text className="text-slate-50 mb-2 text-sm font-medium leading-none">
                      Select a Badge
                    </Text>
                    <Select
                      placeholder="Select option"
                      className="flex text-slate-50 opacity-70 text-sm font-normal leading-tight"
                      color="white"
                      onChange={handleBadgeSelectChange}
                    >
                      {inputBadgeTitleList?.map((title, index) => (
                        <option key={index} value={title}>
                          {title}
                        </option>
                      ))}
                    </Select>
                  </Card>
                </>
              )}
              {inputBadge?.allowComment && (
                <Flex className="w-full mt-2 flex-col">
                  <Flex className="gap-4 pb-4 justify-start items-center">
                    <CommentIcon />
                    <Textarea
                      className="text-slate-50 text-base font-normal leading-snug border-none"
                      placeholder="Share your experience!"
                      _placeholder={{
                        className: "text-slate-50 opacity-30",
                      }}
                      focusBorderColor={"#F5FFFF1A"}
                      value={text}
                      onChange={handleTextareaChange}
                      rows={1}
                      minH="unset"
                      resize="none"
                    />
                  </Flex>
                  <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                </Flex>
              )}
              {badgeInputAddress &&
                inputBadge &&
                inputBadge.title === "Check-out" && (
                  <Box>
                    <Flex className="p-4 gap-4 items-center">
                      <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                        &#x26A0;WARNING&#x26A0;
                        <br />
                        {`This action is irreversible. You are checking out in the name of ` +
                          badgeInputAddress.getEllipsedAddress() +
                          `. Make sure that this is the correct address. That you have their consent. Or that the event has ended.`}
                      </Text>
                    </Flex>
                  </Box>
                )}
            </Box>
            <Box className="px-6 py-4 sm:px-[60px] w-full">
              <Button
                className="w-full px-6 py-4 bg-[#B1EF42] text-black rounded-lg"
                _hover={{ bg: "#B1EF42" }}
                _active={{ bg: "#B1EF42" }}
                isLoading={loading}
                spinner={<BeatLoader size={8} color="white" />}
                onClick={() => {
                  setLoading(true);
                  handleAttest();
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
              <Flex className="flex justify-center items-center px-1 py-1.5 bg-slate-50 bg-opacity-5 rounded-[100px] w-[100px] h-[100px]">
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
                  <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    Receiver
                  </Text>
                  <Flex gap={2}>
                    <Text
                      color="white"
                      className="pl-4 text-slate-50 text-sm font-normal leading-tight"
                    >
                      {badgeInputAddress?.getEllipsedAddress()}
                    </Text>
                  </Flex>
                </Flex>
                <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                <Flex className="py-4 gap-4 items-center">
                  <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    Badge
                  </Text>
                  <Flex gap={2} className="w-full">
                    {inputBadge && (
                      <Textarea
                        color="white"
                        className="text-opacity-100 disabled text-slate-50 opacity-100 text-sm font-normal border-none"
                        readOnly={true}
                        _readOnly={{
                          opacity: 1,
                          cursor: "not-allowed",
                        }}
                        disabled={true}
                        value={inputBadge?.title}
                        rows={inputBadge?.title.length > 50 ? 3 : 1}
                        minH="unset"
                        resize="none"
                      ></Textarea>
                    )}
                  </Flex>
                </Flex>
                <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                {commentBadge && (
                  <Flex className="py-4 gap-4 items-center">
                    <Text className="flex min-w-[80px] text-slate-50 opacity-70 text-sm font-normal leading-tight">
                      Comment
                    </Text>
                    <Flex gap={2} className="w-full">
                      <Textarea
                        color="white"
                        className="text-opacity-100 disabled text-slate-50 opacity-100 text-sm font-normal border-none"
                        readOnly={true}
                        _readOnly={{
                          opacity: 1,
                          cursor: "not-allowed",
                        }}
                        disabled={true}
                        value={commentBadge}
                        rows={commentBadge.length > 50 ? 3 : 1}
                        minH="unset"
                        resize="none"
                      ></Textarea>
                    </Flex>
                  </Flex>
                )}
                {commentBadge && (
                  <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
                )}
              </Flex>
            </Box>
          </>
        );
    }
  };

  return (
    <Flex flexDirection="column" minHeight="100vh">
      {renderStepContent(addressStep)}
    </Flex>
  );
};
