/* eslint-disable react-hooks/exhaustive-deps */
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
import { scroll } from "viem/chains";
import { useDisconnect } from "wagmi";
import { useAccount, useSwitchChain } from "wagmi";

import { AdminIcon, LogoutIcon } from "@/components/01-atoms";
import { useNotify } from "@/hooks";
import { ROLES } from "@/lib/client/constants";
import { hasRole } from "@/lib/service/hasRole";
import { wagmiConfig } from "@/wagmi";

import { EnsAvatar, EnsName } from "../02-molecules";

export const DropdownProfile = ({
  isOpenMenu,
  onClose,
}: {
  isOpenMenu: boolean;
  onClose: () => void;
}) => {
  const { disconnect } = useDisconnect({ config: wagmiConfig });
  const { push } = useRouter();
  const { address, chainId } = useAccount();
  const { notifyError } = useNotify();

  const [isRoot, setIsRoot] = useState<boolean>(false);
  const { switchChain } = useSwitchChain();

  //Checks if the user has the `Manager` or `Root` badge
  useEffect(() => {
    checkUserRole();
  }, [address]);

  const checkUserRole = async () => {
    if (!address) {
      return;
    }
    if (chainId !== scroll.id) {
      notifyError({
        title: "Unsupported network",
        message: "Please switch to the Scroll network to use this application.",
      });
      switchChain({ chainId: scroll.id });
      return;
    }
    if (await hasRole(ROLES.ROOT, address)) {
      setIsRoot(true);
      return;
    }
    if (await hasRole(ROLES.MANAGER, address)) {
      setIsRoot(true);
      return;
    }
  };

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
              <Heading size="md">Options</Heading>
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
                  push("/admin");
                }}
              >
                <AdminIcon className="w-6 h-6 text-[#F5FFFF80] opacity-70" />
                <Flex gap={2} alignItems={"center"}>
                  <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight ">
                    Admin
                  </Text>
                </Flex>
              </Flex>
            )}
            <Flex gap={4} alignItems={"center"} flexDirection={"row"} p={4}>
              <EnsAvatar size={"xs"} ensAddress={address as `0x${string}`} />
              <EnsName
                ensAddress={address as `0x${string}`}
                copyToClipboard={true}
                externalLink={true}
              />
            </Flex>
          </CardBody>
        </Card>
      </Slide>
    </>
  );
};
