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
import router from "next/router";
import { LogoutIcon, UserIcon } from "@/components/01-atoms";

export const DropdownProfile = ({ isOpenMenu }: { isOpenMenu: boolean }) => {
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
      <Card
        className="cursor-pointer"
        background={"#212223"}
        border={2}
        onClick={() => {
          router.push(`my-badge-1`); //TODO: Replace with dynamic route ID
          console.log("Card Clicked go to Details of this Card");
        }}
      >
        <CardHeader
          gap={4}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Flex gap={4} className={"items-center"}>
            <Heading size="md">Profile options</Heading>
          </Flex>
          <Flex className={"items-center"} gap={2}>
            <CloseIcon />
          </Flex>
        </CardHeader>
        <Divider color={"#F5FFFF14"} />
        <CardBody gap={4} display={"flex"} flexDirection={"column"}>
          <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
            <LogoutIcon className="w-6 h-6 text-[#F5FFFF80]" />
            <Flex gap={2} alignItems={"center"}>
              <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                Disconnect
              </Text>
            </Flex>
          </Flex>
          <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
            <UserIcon className="w-6 h-6 text-[#F5FFFF80]" />
            <Flex gap={2} alignItems={"center"}>
              <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                Profile
              </Text>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Slide>
  );
};
