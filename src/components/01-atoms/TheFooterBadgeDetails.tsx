import { Box, Flex, Text } from "@chakra-ui/react";

import { ArrowIcon, ArrowIconVariant } from "./icons/ArrowIcon";
import { GiveBadgeStepAddress } from "../04-templates";

export enum ButtonClickPossibilities {
  PREVIOUS_STEP,
  NEXT_STEP,
}

export const TheFooterBadgeDetails = ({
  actualStep,
  onUpdateStep,
}: {
  actualStep: GiveBadgeStepAddress;
  onUpdateStep: (newStep: GiveBadgeStepAddress) => void;
}) => {
  const updateAddressStep = (buttonClicked: ButtonClickPossibilities) => {
    switch (actualStep) {
      case GiveBadgeStepAddress.INSERT_ADDRESS:
        if (buttonClicked === ButtonClickPossibilities.NEXT_STEP) {
          onUpdateStep(GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT);
        }
        break;
      case GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT:
        if (buttonClicked === ButtonClickPossibilities.PREVIOUS_STEP) {
          onUpdateStep(GiveBadgeStepAddress.INSERT_ADDRESS);
        } else if (buttonClicked === ButtonClickPossibilities.NEXT_STEP) {
          onUpdateStep(GiveBadgeStepAddress.CONFIRMATION);
        }
        break;
      case GiveBadgeStepAddress.CONFIRMATION:
        if (buttonClicked === ButtonClickPossibilities.PREVIOUS_STEP) {
          onUpdateStep(GiveBadgeStepAddress.INSERT_BADGE_AND_COMMENT);
        }
        break;
    }
  };
  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      zIndex={10}
      textAlign={"center"}
      className="px-6 py-4 bg-[#161617] w-full flex group border-t border-[#F5FFFF14] border-opacity-[8]"
    >
      <Flex gap={4} className="w-full justify-between items-center">
        <Text>Continue</Text>
        <button
          className="flex rounded-full bg-[#37383A] justify-center items-center w-8 h-8"
          onClick={() => updateAddressStep(ButtonClickPossibilities.NEXT_STEP)}
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
