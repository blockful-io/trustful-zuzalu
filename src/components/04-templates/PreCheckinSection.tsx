import { useContext, useEffect } from "react";

import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

import { TheFooterNavbar, TheHeader } from "@/components/01-atoms";
import { useNotify } from "@/hooks/useNotify";
import { WalletContext } from "@/lib/context/WalletContext";

export const PreCheckinSection = () => {
  const { notifyError } = useNotify();
  const { push } = useRouter();

  const { villagerAttestationCount } = useContext(WalletContext);

  useEffect(() => {
    if (villagerAttestationCount) {
      notifyError({
        title: "You have already checked in",
        message: "Redirecting to your badges.",
      });
      push("/my-badges");
    }
  }, [villagerAttestationCount]);

  return (
    <Flex flexDirection="column" minHeight="100vh">
      {villagerAttestationCount !== null ? (
        <>
          <TheHeader />
          {villagerAttestationCount === 0 && (
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
              <Image
                src="/img/zuvillage.png"
                alt="ZuVillage Georgia Have Fun"
                objectFit="cover"
                width={300}
                height={300}
              />
            </Button>
          )}
          <TheFooterNavbar />
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
