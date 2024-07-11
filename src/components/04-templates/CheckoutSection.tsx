import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";

import {
  CircleQuestion,
  QRCodeLargeIcon,
  TheFooterNavbar,
  TheHeader,
} from "@/components/01-atoms";

export const CheckoutSection = () => {
  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col items-center"
        gap={6}
      >
        <Card className="px-8 py-6" background={"#212223"} border={2} gap={8}>
          <CardHeader
            gap={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"column"}
            p={0}
          >
            <Flex className={"items-center"}>
              <Text className="text-center text-lime-400 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                Check out ZuGeorgia
              </Text>
            </Flex>
            <Flex className={"items-center"} gap={2}>
              <Text className="text-center text-slate-50 text-base font-normal  leading-snug">
                To finish your session, please scan the QR code.
              </Text>
            </Flex>
          </CardHeader>
          <CardBody display={"flex"} flexDirection={"column"} p={0}>
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              flexDirection={"row"}
            >
              <QRCodeLargeIcon />
            </Flex>
          </CardBody>
        </Card>
        <Flex flexDirection={"column"} className="w-full h-full items-center">
          <Divider className="border-slate-50 opacity-10 w-full" />
          <Flex className="w-full flex-row py-3" gap={4}>
            <CircleQuestion />
            <Flex flexDirection={"column"} justifyContent={"center"}>
              <Text className="text-slate-50 text-sm font-normal  leading-tight">
                What is the check out for?
              </Text>
            </Flex>
          </Flex>
          <Divider className="border-slate-50 opacity-10 w-full" />
          <Flex className="w-full flex-row py-3" gap={4}>
            <CircleQuestion />
            <Flex flexDirection={"column"} justifyContent={"center"}>
              <Text className="text-slate-50 text-sm font-normal  leading-tight">
                What this means?
              </Text>
            </Flex>
          </Flex>
          <Divider className="border-slate-50 opacity-10 w-full" />
          <Flex className="w-full flex-row py-3" gap={4}>
            <CircleQuestion />
            <Flex flexDirection={"column"} justifyContent={"center"}>
              <Text className="text-slate-50 text-sm font-normal  leading-tight">
                How to connect organizer?
              </Text>
            </Flex>
          </Flex>
          <Divider className="border-slate-50 opacity-10 w-full" />
        </Flex>
      </Box>
      <TheFooterNavbar />
    </Flex>
  );
};
