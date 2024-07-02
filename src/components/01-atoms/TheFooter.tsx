"use client";
import { type FC } from "react";

import { Box } from "@chakra-ui/react";

import { CreatedByBlockful } from "@/components/01-atoms";

export const TheFooter: FC = () => {
  return (
    <Box
      as="footer"
      position="sticky"
      bottom={0}
      zIndex={10}
      textAlign={"center"}
      className="px-6 py-7 sm:p-0"
    >
      <CreatedByBlockful />
    </Box>
  );
};
