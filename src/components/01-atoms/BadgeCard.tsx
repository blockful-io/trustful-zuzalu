/* eslint-disable react/jsx-no-undef */
import {
  SimpleGrid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  Text,
  Divider,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import {
  ArrowIcon,
  ArrowIconVariant,
  BadgeStatus,
  BadgeTagIcon,
  CalendarIcon,
  HeartIcon,
} from "@/components/01-atoms";

export const BadgeCard = () => {
  const router = useRouter();
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(255px, 1fr))"
    >
      <Card
        className="cursor-pointer"
        background={"#F5FFFF0D"}
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
            <HeartIcon className="w-4 h-4" />
            <Heading size="md">CheckIn</Heading>
          </Flex>
          <Flex className={"items-center"} gap={2}>
            <BadgeTagIcon status={BadgeStatus.CONFIRMED} />
            <ArrowIcon variant={ArrowIconVariant.RIGHT} />
          </Flex>
        </CardHeader>
        <Divider color={"#F5FFFF14"} />
        <CardBody gap={4} display={"flex"} flexDirection={"column"}>
          <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
            <CalendarIcon className="w-6 h-6" />
            <Flex gap={2} alignItems={"center"}>
              <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                Date
              </Text>
              <Text>Jun 19th - 3:32pm</Text>
            </Flex>
          </Flex>
          <Flex gap={4} alignItems={"center"} flexDirection={"row"}>
            <Avatar className="w-6 h-6" />
            <Flex gap={2} alignItems={"center"}>
              <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                Issued by
              </Text>
              <Text>crazy_monkey.eth</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};
