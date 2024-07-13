import { useState, useEffect } from "react";

import { CloseIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Text,
  Flex,
  Heading,
  Slide,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { useAccount } from "wagmi";

import { LogoutIcon, UserIcon } from "@/components/01-atoms";
import { ZUVILLAGE_BADGE_TITLES } from "@/lib/client/constants";

import { hasRole } from "../../lib/service/hasRole";

export const DropdownProfile = ({
  isOpenMenu,
  onClose,
}: {
  isOpenMenu: boolean;
  onClose: () => void;
}) => {
  const { disconnect } = useDisconnect();
  const { push } = useRouter();
  const { address } = useAccount();

  const [isRoot, setIsRoot] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      const checkUserRole = async () => {
        let isAdminRole = false;
        for (const badge of ZUVILLAGE_BADGE_TITLES) {
          if (badge.title === "Manager") {
            const hasManagerRole = await hasRole(badge.allowedRole, address);
            console.log("hasManagerRole", hasManagerRole);
            if (hasManagerRole) {
              isAdminRole = true;
              break;
            }
          }
        }
        console.log("adminRole", isAdminRole);
        setIsRoot(isAdminRole);
        console.log("isRoot", isRoot);
      };
      checkUserRole();
    }
  }, [address]);

  return (
    <>
      <div
        className={
          `fixed left-0 top-0 w-full h-full z-50 backdrop-blur-sm transition-all duration-300 cursor-default` +
          (isOpenMenu
            ? "opacity-100 inset-0 cursor-default"
            : "opacity-0 z-[-1]")
        }
        role="button"
        onClick={onClose}
      />

      <Slide
        direction="bottom"
        in={isOpenMenu}
        style={{
          zIndex: 1000,
          position: "fixed",
          bottom: "0",
          background: "#212223",
        }}
      >
        <Card className="cursor-pointer" background={"#212223"} border={2}>
          <CardHeader
            p={4}
            gap={4}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            color="white"
            opacity={0.7}
          >
            <Flex gap={4} className={"items-center"}>
              <Heading size="md">Profile options</Heading>
            </Flex>
            <Flex className={"items-center"} gap={2}>
              <CloseIcon onClick={onClose} />
            </Flex>
          </CardHeader>
          <Divider color={"#F5FFFF14"} />
          <CardBody p={0} display={"flex"} flexDirection={"column"}>
            <Flex
              gap={4}
              alignItems={"center"}
              flexDirection={"row"}
              p={4}
              onClick={() => {
                disconnect();
                push("/");
              }}
            >
              <LogoutIcon className="w-6 h-6 text-[#F5FFFF80]" />
              <Flex gap={2} alignItems={"center"}>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight ">
                  Disconnect
                </Text>
              </Flex>
            </Flex>
            {isRoot && (
              <Flex
                gap={4}
                alignItems={"center"}
                flexDirection={"row"}
                p={4}
                onClick={() => {
                  //admin();
                  push("/");
                }}
              >
                {/*<adminIcon className="w-6 h-6 text-[#F5FFFF80]" />*/}
                <Flex gap={2} alignItems={"center"}>
                  <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight ">
                    Admin
                  </Text>
                </Flex>
              </Flex>
            )}
            <Flex
              gap={4}
              alignItems={"center"}
              flexDirection={"row"}
              p={4}
              justifyContent={"space-between"}
            >
              <Flex gap={3} alignItems={"center"}>
                <UserIcon className="w-6 h-6 text-[#F5FFFF80]" />
                <Flex>
                  <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                    Profile
                  </Text>
                </Flex>
              </Flex>
              <Text className="h-6 p-2 bg-slate-50 bg-opacity-10 rounded-full justify-center items-center inline-flex text-slate-50 text-xs font-medium uppercase leading-[13.20px] tracking-wide">
                coming soon
              </Text>
            </Flex>
          </CardBody>
        </Card>
      </Slide>
    </>
  );
};
