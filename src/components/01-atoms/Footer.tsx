"use client";
import { type FC } from "react";

import { Flex } from "@chakra-ui/react";

import { BlockfulLogo } from "@/components/01-atoms";

export const Footer: FC = () => {
  return (
    <Flex
      as="footer"
      p={"1rem"}
      position="sticky"
      bottom={0}
      zIndex={10}
      textAlign={"left"}
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium leading-[13.2px] uppercase tracking-[0.48px] font-['Inter'] text-[#F5FFFF80] opacity-50">
          Created by
        </p>
        <BlockfulLogo className="w-full flex" />
      </div>
    </Flex>
  );
};
