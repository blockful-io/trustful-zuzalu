import { useContext } from "react";

import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { ArrowIcon, ArrowIconVariant } from "@/components/01-atoms";
import { GiveBadgeStepAddress } from "@/components/04-templates";
import { GiveBadgeContext } from "@/lib/context/GiveBadgeContext";

export const BadgeDetailsNavigation = ({
  isDetail = false,
  isFeedback = false,
}: {
  isDetail?: boolean;
  isFeedback?: boolean;
}) => {
  const { setAddressStep } = useContext(GiveBadgeContext);
  const router = useRouter();
  const handleBack = () => {
    setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
  };

  if (isDetail) {
    return (
      <Box
        className="w-full flex items-center p-4"
        onClick={() => {
          router.push(`my-badges`);
        }}
      >
        <Flex className="cursor-pointer p-2 opacity-80" color="white">
          <ArrowIcon variant={ArrowIconVariant.LEFT} />
        </Flex>
        <Flex justifyContent={"center"} className="w-full">
          <Text className="text-slate-50 text-sm font-medium uppercase leading-none tracking-wide">
            BADGE DETAILS
          </Text>
        </Flex>
      </Box>
    );
  }

  return !isFeedback ? (
    <Box className="w-full flex items-center p-4">
      <Flex
        onClick={handleBack}
        className="cursor-pointer p-2 opacity-80"
        color="white"
      >
        <ArrowIcon variant={ArrowIconVariant.LEFT} />
      </Flex>
      <Flex justifyContent={"center"} className="w-full">
        <Text className="text-slate-50 text-sm font-medium uppercase leading-none tracking-wide">
          BADGE DETAILS
        </Text>
      </Flex>
    </Box>
  ) : isFeedback ? (
    <Box className="w-full flex items-center p-4">
      <Flex
        onClick={handleBack}
        className="cursor-pointer p-2 opacity-80"
        color="white"
      >
        <CloseIcon />
      </Flex>
    </Box>
  ) : null;
};
