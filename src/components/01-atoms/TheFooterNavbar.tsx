import { Box, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

import { BadgeIcon, HeartIcon, LogoutIcon } from "@/components/01-atoms/";

export const TheFooterNavbar = () => {
  const params = useParams();
  const router = useRouter();

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      zIndex={10}
      textAlign={"center"}
      className="px-6 sm:p-0 bg-[#161617] w-full flex group border-t border-[#F5FFFF14] border-opacity-[8]"
    >
      <Flex gap={4} className="w-full justify-center">
        <Box
          className={`flex flex-col justify-center items-center py-3 gap-2 border-t ${params.slug == "my-badge" ? "border-[#B1EF42]" : "border-transparent"}`}
          onClick={() => router.push("/my-badge")}
        >
          <BadgeIcon />
          <Text>My badges</Text>
        </Box>
        <Box
          className={`flex flex-col justify-center items-center py-3 gap-2 border-t ${params.slug == "give-badge" ? "border-[#B1EF42]" : "border-transparent"}`}
          onClick={() => router.push("/give-badge")}
        >
          <HeartIcon />
          <Text>Give badge</Text>
        </Box>
        <Box
          className={`flex flex-col justify-center items-center py-3 gap-2 border-t ${params.slug == "check-out" ? "border-[#B1EF42]" : "border-transparent"}`}
          onClick={() => router.push("/check-out")}
        >
          <LogoutIcon />
          <Text>Check out</Text>
        </Box>
      </Flex>
    </Box>
  );
};
