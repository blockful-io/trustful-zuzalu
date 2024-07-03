import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

import {
  TheHeader,
  TheFooterNavbar,
  QrCodeIcon,
  UserIcon,
} from "@/components/01-atoms";

export const GiveBadgeSection = () => {
  const params = useParams();
  const router = useRouter();
  console.log("params in MyBadgeSection", params);
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center fle flex-col items-center"
      >
        <Flex flexDirection={"column"} className="w-full gap-8">
          <Flex>
            <Text className="text-slate-50 text-2xl font-normal font-['Space Grotesk'] leading-loose">
              Let&apos;s give a badge to someone
            </Text>
          </Flex>
          <Flex className="flex-col">
            <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
            <Flex
              className="py-4 gap-4"
              onClick={() => router.push("/give-badge-address")} // TO DO: Add address to correct router or add useState to fill the step
            >
              <UserIcon />
              <Text>Insert address or ENS</Text>
            </Flex>
            <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
            <Flex className="py-4 gap-4">
              <QrCodeIcon />
              <Text>Scan QR code</Text>
            </Flex>
            <Divider className="w-full border-t border-[#F5FFFF1A] border-opacity-10" />
          </Flex>
        </Flex>
      </Box>
      <TheFooterNavbar />
    </Flex>
  );
};
