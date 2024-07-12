import { Box, Flex } from "@chakra-ui/react";

import { TheHeader } from "@/components/01-atoms";
import { MainPane } from "@/components/03-organisms";
import { useWindowSize } from "@/hooks";

export const HomeSection = () => {
  const { isMobile } = useWindowSize();

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />
      {isMobile && (
        <Box
          flex={1}
          as="main"
          width="100%"
          height="100vh"
          backgroundImage="url('/img/Background.png')"
          backgroundRepeat="round"
          backgroundSize="auto"
          className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center sm:justify-normal"
        >
          <MainPane />
        </Box>
      )}
      {!isMobile && (
        <Box
          flex={1}
          as="main"
          width="100%"
          height="100vh"
          backgroundImage="url('/img/owl_right_negative_shadow.png')"
          backgroundSize="100%"
          backgroundRepeat="no-repeat"
          className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center sm:justify-normal"
        >
          <MainPane />
        </Box>
      )}
    </Flex>
  );
};
