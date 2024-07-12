import { Box, Card, CardHeader, Text, Flex, Button } from "@chakra-ui/react";

import { TheFooterNavbar, TheHeader } from "@/components/01-atoms";

export const CheckOutSection = () => {
  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col items-center"
        gap={6}
      >
        <Card
          className="px-8 py-6 mt-6"
          background={"#212223"}
          border={2}
          gap={8}
        >
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
                Check out of ZuGeorgia
              </Text>
            </Flex>
            <Flex className={"items-center"} gap={2}>
              <Text className="text-center text-slate-50 text-base font-normal  leading-snug">
                Are you sure you want to check out?
                <br />
                This proccess is irreversible.
              </Text>
            </Flex>
          </CardHeader>
          <Box className="px-6 py-4 sm:px-[60px] w-full">
            <Button
              className="w-full px-6 py-4 bg-[#ef4343] text-white rounded-lg"
              _hover={{ bg: "#ef4343" }}
              _active={{ bg: "#ef4343" }}
              // isLoading={loading}
              // onClick={() => {
              //   setLoading(true);
              //   handleAttest();
              // }}
              // TODO ->
              // open Modal
              // fetch check-in time
              // calculate total time in event
              // display button to confirm
              // send transaction
              // display thank you message
            >
              Confirm
            </Button>
          </Box>
        </Card>
      </Box>
      <TheFooterNavbar />
    </Flex>
  );
};
