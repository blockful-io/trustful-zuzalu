import { useContext } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

import { BadgeIcon, HeartIcon, LogoutIcon } from "@/components/01-atoms/";
import { WalletContext } from "@/lib/context/WalletContext";

export const TheFooterNavbar = () => {
  const params = useParams();
  const { push } = useRouter();
  const { villagerAttestationCount } = useContext(WalletContext);

  const option =
    villagerAttestationCount === 0
      ? "Check In"
      : villagerAttestationCount === 1
        ? "Check Out"
        : "Thank You";

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      zIndex={0}
      textAlign={"center"}
      className="px-6 sm:p-0 bg-[#161617] w-full flex group border-t border-[#F5FFFF14] border-opacity-[8]"
    >
      <Flex gap={4} className="w-full justify-center">
        <Box
          className={`flex flex-col justify-center items-center py-3 gap-2 border-t ${params.slug == "my-badge" ? "border-[#B1EF42]" : "border-transparent"}`}
          onClick={() => push("/my-badge")}
        >
          <BadgeIcon
            className={`w-5 h-5 text-white ${params.slug == "my-badge" ? "opacity-100" : "opacity-50"}`}
          />
          <Text
            className={`text-slate-50 ${params.slug == "my-badge" ? "opacity-100" : "opacity-50"} text-sm font-medium  leading-none`}
          >
            My badges
          </Text>
        </Box>
        <Box
          className={`flex flex-col justify-center items-center py-3 gap-2 border-t ${params.slug == "give-badge" ? "border-[#B1EF42]" : "border-transparent"}`}
          onClick={() => push("/give-badge")}
        >
          <HeartIcon
            className={`w-5 h-5 text-white ${params.slug == "give-badge" ? " opacity-100" : "opacity-50"}`}
          />
          <Text
            className={`text-slate-50 ${params.slug == "give-badge" ? "opacity-100" : "opacity-50"} text-sm font-medium  leading-none`}
          >
            Give badge
          </Text>
        </Box>
        <Box
          className={`flex flex-col justify-center items-center py-3 gap-2 border-t ${params.slug == "check-out" ? "border-[#B1EF42]" : "border-transparent"}`}
          onClick={() => push("/check-out")}
        >
          <LogoutIcon
            className={`w-5 h-5 text-white ${params.slug == "check-out" ? "opacity-100" : "opacity-50"}`}
          />
          <Text
            className={`text-slate-50 ${params.slug == "check-out" ? "opacity-100" : "opacity-50"} text-sm font-medium  leading-none`}
          >
            {option}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
