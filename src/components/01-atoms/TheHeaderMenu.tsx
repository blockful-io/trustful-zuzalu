import { Menu, MenuButton, IconButton, Avatar, Flex } from "@chakra-ui/react";

import { ArrowIcon, ArrowIconVariant } from "./icons/ArrowIcon";
import { Address } from "../02-molecules/Address";

export const TheHeaderMenu = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={
          <>
            <Flex className="p-[6px] gap-2 items-center">
              <Avatar className="w-6 h-6" />
              <Address />
              <ArrowIcon
                variant={ArrowIconVariant.DOWN}
                props={{ className: "w-3 h-3 text-[#F5FFFF80]" }}
              />
            </Flex>
          </>
        }
        className="bg-[#F5FFFF14] bg-opacity-[8]"
      />
    </Menu>
  );
};
