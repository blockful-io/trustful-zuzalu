import { Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { TheFooterNavbar, TheHeader } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";
import { useContext } from "react";
import { WalletContext } from "@/lib/context/WalletContext";

export const PreCheckInSection = () => {
  const { push } = useRouter();
  const { isMobile } = useWindowSize();

  const { villagerAttestationCount } = useContext(WalletContext);

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <TheHeader />
      <Button
        flex="1"
        padding="0"
        onClick={() => push("/checkin")}
        display="flex"
        justifyContent="center"
        alignItems="center"
        color={"transparent"}
        backgroundColor={"transparent"}
        _hover={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
      >
        {isMobile &&
          villagerAttestationCount &&
          villagerAttestationCount == 0 && (
            <Image
              src="/img/zuvillage.png"
              alt="ZuVillage Georgia Have Fun"
              objectFit="cover"
              width={300}
              height={300}
            />
          )}
        {!isMobile &&
          villagerAttestationCount &&
          villagerAttestationCount === 0 && (
            <Image
              src="/img/zuvillage.png"
              alt="ZuVillage Georgia Have Fun"
              objectFit="cover"
              width={300}
              height={300}
            />
          )}
      </Button>
      <TheFooterNavbar />
    </Flex>
  );
};
