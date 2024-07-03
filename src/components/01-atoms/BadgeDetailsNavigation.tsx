import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { ArrowIcon, ArrowIconVariant } from "./icons/ArrowIcon";

export const BadgeDetailsNavigation = ({
  isDetail = false,
  isFeedback = false,
}: {
  isDetail: boolean;
  isFeedback: boolean;
}) => {
  console.log("BadgeDetailsNavigation", isDetail, isFeedback);
  const router = useRouter();
  return (
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
  );
};
