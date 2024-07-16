import { useState } from "react";

import { Menu, MenuButton, IconButton, Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import {
  ArrowIcon,
  ArrowIconVariant,
  DropdownProfile,
} from "@/components/01-atoms";

import { EnsAvatar } from "../02-molecules";

export const TheHeaderMenu = () => {
  const { address } = useAccount();
  const closeMenu = () => setIsOpenMenu(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={
            <Flex className="p-[6px] gap-2 items-center">
              <EnsAvatar size={"xs"} ensAddress={address as `0x${string}`} />
              <ArrowIcon
                variant={ArrowIconVariant.DOWN}
                props={{ className: "w-3 h-3 text-[#F5FFFF80]" }}
              />
            </Flex>
          }
          className="bg-[#F5FFFF00] px-1"
          _hover={{ bg: "#B1EF42D9" }}
          _active={{ bg: "#B1EF42D9" }}
          onClick={() => setIsOpenMenu(!isOpenMenu)}
        />
      </Menu>
      {isOpenMenu && (
        <DropdownProfile isOpenMenu={isOpenMenu} onClose={closeMenu} />
      )}
    </>
  );
};
