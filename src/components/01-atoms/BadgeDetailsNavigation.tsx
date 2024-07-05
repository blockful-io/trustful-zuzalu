import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { ArrowIcon, ArrowIconVariant } from "./icons/ArrowIcon";

export const BadgeDetailsNavigation = ({
  isDetail = false,
  isFeedback = false,
  isQRCode = false,
}: {
  isDetail?: boolean;
  isFeedback?: boolean;
  isQRCode?: boolean;
}) => {
  const router = useRouter();
  return !isDetail && !isFeedback && !isQRCode ? (
    <Box className="w-full flex items-center p-4">
      <Flex onClick={() => router.back()} className="cursor-pointer p-2">
        <ArrowIcon variant={ArrowIconVariant.LEFT} />
      </Flex>
      <Flex justifyContent={"center"} className="w-full">
        <Text className="text-slate-50 text-sm font-medium font-['Inter'] uppercase leading-none tracking-wide">
          BADGE DETAILS
        </Text>
      </Flex>
    </Box>
  ) : isFeedback && !isDetail ? (
    <Box className="w-full flex items-center p-4">
      <Flex onClick={() => router.back()} className="cursor-pointer p-2">
        <CloseIcon />
      </Flex>
    </Box>
  ) : isQRCode ? (
    <Box className="w-full flex items-center p-4">
      <Flex onClick={() => router.back()} className="cursor-pointer p-2">
        <ArrowIcon variant={ArrowIconVariant.LEFT} />
      </Flex>
      <Flex justifyContent={"center"} className="w-full">
        <Text className="text-slate-50 text-sm font-medium font-['Inter'] uppercase leading-none tracking-wide">
          QR CODE SCANNER
        </Text>
      </Flex>
    </Box>
  ) : null;
};
