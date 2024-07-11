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
import { useDisconnect } from "wagmi";

import { LogoutIcon, UserIcon } from "@/components/01-atoms";
import { useRouter } from "next/navigation";

export const DropdownProfile = ({
  isOpenMenu,
  onClose,
}: {
  isOpenMenu: boolean;
  onClose: () => void;
}) => {
  const { disconnect } = useDisconnect();
  const { push } = useRouter();

  return (
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
  );
};
