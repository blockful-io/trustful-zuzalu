import { useContext } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";

import { ArrowIcon, ArrowIconVariant } from "@/components/01-atoms";
import { GiveBadgeStepAddress } from "@/components/04-templates";
import { QRCodeContext } from "@/lib/context/QRCodeContext";

export const TheFooterBadgeDetails = () => {
  const { setAddressStep } = useContext(QRCodeContext);

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      zIndex={0}
      textAlign={"center"}
      className="px-6 py-4 sm:px-[60px] sm:py-4 bg-[#161617] w-full flex group border-t border-[#F5FFFF14] border-opacity-[8]"
    >
      <Flex gap={4} className="w-full justify-between items-center">
        <Text>Continue</Text>
        <button
          className="flex rounded-full bg-[#37383A] justify-center items-center w-8 h-8"
          onClick={() =>
            setAddressStep(GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT)
          }
        >
          <ArrowIcon
            variant={ArrowIconVariant.RIGHT}
            props={{ className: "text-[#F5FFFFB2]" }}
          />
        </button>
      </Flex>
    </Box>
  );
};
