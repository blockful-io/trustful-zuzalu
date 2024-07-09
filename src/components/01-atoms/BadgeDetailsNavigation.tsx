import { useContext } from "react";

import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";

import { ArrowIcon, ArrowIconVariant } from "@/components/01-atoms";
import {
  GiveBadgeAction,
  GiveBadgeStepAddress,
} from "@/components/04-templates";
import { QRCodeContext } from "@/lib/context/QRCodeContext";

export const BadgeDetailsNavigation = ({
  isDetail = false,
  isFeedback = false,
  isQRCode = false,
}: {
  isDetail?: boolean;
  isFeedback?: boolean;
  isQRCode?: boolean;
}) => {
  const { setAddressStep, setAction } = useContext(QRCodeContext);

  return !isDetail && !isFeedback && !isQRCode ? (
    <Box className="w-full flex items-center p-4">
      <Flex
        onClick={() => {
          setAction(GiveBadgeAction.ADDRESS);
          setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
        }}
        className="cursor-pointer p-2"
      >
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
      <Flex
        onClick={() => {
          setAction(GiveBadgeAction.ADDRESS);
          setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
        }}
        className="cursor-pointer p-2"
      >
        <CloseIcon />
      </Flex>
    </Box>
  ) : isQRCode ? (
    <Box className="w-full flex items-center p-4">
      <Flex className="cursor-pointer p-2">
        <ArrowIcon
          variant={ArrowIconVariant.LEFT}
          props={{
            onClick: () => {
              setAction(GiveBadgeAction.ADDRESS);
              setAddressStep(GiveBadgeStepAddress.INSERT_ADDRESS);
            },
          }}
        />
      </Flex>
      <Flex justifyContent={"center"} className="w-full">
        <Text className="text-slate-50 text-sm font-medium font-['Inter'] uppercase leading-none tracking-wide">
          QR CODE SCANNER
        </Text>
      </Flex>
    </Box>
  ) : null;
};
