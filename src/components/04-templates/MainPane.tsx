// components/MainPane.tsx
import { type FC } from "react";

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { CreatedByBlockful } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";
import styles from "@/styles/mainPane.module.css";

export const MainPane: FC = () => {
  const { isConnected } = useAccount();
  const { isMobile } = useWindowSize();

  return (
    <Box className={styles.container}>
      <Flex>
        <Heading
          as="h2"
          className="text-[52px] font-normal font-['Space Grotesk'] leading-[57.20px]"
        >
          Online reputation made easy
        </Heading>
      </Flex>
      <Flex className={styles.content}>
        {!isConnected && <Button colorScheme="blue">Button</Button>}
      </Flex>
      {!isMobile && <CreatedByBlockful />}
    </Box>
  );
};
