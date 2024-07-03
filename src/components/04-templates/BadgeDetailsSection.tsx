import { Avatar, Box, Card, Divider, Flex, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";

import {
  BadgeStatus,
  BadgeTagIcon,
  HeartIcon,
  TheHeader,
  TheFooterNavbar,
} from "@/components/01-atoms";
import { BadgeDetails } from "@/components/03-organisms";

export const BadgeDetailsSection = () => {
  const params = useParams();
  console.log("params in MyBadgeSection", params);
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />
      <BadgeDetails />
      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center flex-col"
        gap={6}
      >
        <Flex gap={4} className="w-full h-full items-center">
          <Flex>
            <HeartIcon className="w-6 h-6" />
          </Flex>
          <Flex flexDirection={"column"} className="w-full">
            <Box>
              <Text className="text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                Check In ZuGeorgia
              </Text>
            </Box>
            <Flex gap={2} className="items-center">
              <Text className="text-slate-50 text-sm font-normal font-['Inter'] leading-tight">
                Jun 19th - 2:40pm
              </Text>
              <BadgeTagIcon status={BadgeStatus.PENDING} />
            </Flex>
          </Flex>
        </Flex>
        <Card
          background={"#F5FFFF0D"}
          className="w-full border border-[#F5FFFF14] border-opacity-[8]"
        >
          <Flex flexDirection={"column"} className="w-full items-center">
            <Flex className="w-full flex-row p-4" gap={4}>
              <Avatar />
              <Flex flexDirection={"column"} justifyContent={"center"}>
                <Text className="text-slate-50 text-sm font-medium font-['Inter'] leading-none">
                  Issued by
                </Text>
                <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                  crazy_monkey.eth
                </Text>
              </Flex>
            </Flex>
            <Divider className="border-slate-50 opacity-10 w-full" />
            <Flex className="w-full flex-row p-4" gap={4}>
              <Avatar />
              <Flex flexDirection={"column"} justifyContent={"center"}>
                <Text className="text-slate-50 text-sm font-medium font-['Inter'] leading-none">
                  Receiver
                </Text>
                <Text className="text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
                  my_user.eth
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
        <Card
          background={"#F5FFFF0D"}
          className="w-full rounded-lg border border-[#F5FFFF14] border-opacity-[8]"
        >
          <Flex flexDirection={"column"} gap={2} p={4}>
            <Text className="flex text-slate-50 text-sm font-medium font-['Inter'] leading-none">
              Comment
            </Text>
            <Text className="flex text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              accumsan turpis vel enim eleifend ornare. In malesuada urna
              hendrerit leo aliquet, ut euismod elit suscipit.
            </Text>
          </Flex>
        </Card>
        <Card
          background={"#F5FFFF0D"}
          className="w-full rounded-lg border border-[#F5FFFF14] border-opacity-[8]"
        >
          <Flex flexDirection={"column"} gap={2} p={4}>
            <Text className="flex text-slate-50 text-sm font-medium font-['Inter'] leading-none">
              Attestation
            </Text>
            <Text className="flex text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
              0x12312...1ED8
            </Text>
          </Flex>
          <Flex flexDirection={"column"} gap={2} p={4}>
            <Text className="flex text-slate-50 text-sm font-medium font-['Inter'] leading-none">
              Transaction
            </Text>
            <Text className="flex text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
              0x12312...1ED8
            </Text>
          </Flex>
          <Flex flexDirection={"column"} gap={2} p={4}>
            <Text className="flex text-slate-50 text-sm font-medium font-['Inter'] leading-none">
              Scheme
            </Text>
            <Text className="flex text-slate-50 opacity-70 text-sm font-normal font-['Inter'] leading-tight">
              #159
            </Text>
          </Flex>
        </Card>
      </Box>
      <TheFooterNavbar />
    </Flex>
  );
};
