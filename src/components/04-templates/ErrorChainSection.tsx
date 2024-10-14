import { useContext } from "react";

import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { scroll } from "viem/chains";
import { useSwitchChain } from "wagmi";

import { TheHeader } from "@/components/01-atoms";
import { WalletContext } from "@/lib/context/WalletContext";

export const ErrorChainSection = () => {
  const { switchChain, isSuccess } = useSwitchChain();
  const router = useRouter();
  const { villagerAttestationCount } = useContext(WalletContext);

  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      <TheHeader />

      <Box
        flex={1}
        as="main"
        className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center flex-col"
        gap={6}
      >
        <Flex>
          <Button
            className="px-6 py-4 text-black rounded-lg"
            _loading={{
              opacity: 1,
              cursor: "not-allowed",
            }}
            backgroundColor={
              villagerAttestationCount === null ? "transparent" : "#B1EF42"
            }
            isLoading={villagerAttestationCount === null}
            spinner={<BeatLoader size={8} color="#B1EF42" />}
            _hover={{
              bg: "bg-[#B1EF42]",
            }}
            _active={{
              bg: "bg-[#B1EF42]",
            }}
            onClick={() => {
              switchChain({ chainId: scroll.id });
              if (isSuccess) {
                router.push("/");
              }
            }}
          >
            Connect to supported network
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
