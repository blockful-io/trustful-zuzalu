import { Flex } from "@chakra-ui/react";

import { BlockfulLogo } from "@/components/01-atoms/";

export const CreatedByBlockful = () => {
  return (
    <>
      <Flex direction={"column"} gap={2}>
        <p className="text-xs font-medium leading-3 uppercase tracking-wider text-gray-200 opacity-50 text-left">
          Created by
        </p>
        <BlockfulLogo />
      </Flex>
    </>
  );
};
