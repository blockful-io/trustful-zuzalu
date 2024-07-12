import { useContext } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

import {
  BadgeIcon,
  HeartIcon,
  LogoutIcon,
  QrCodeIcon,
} from "@/components/01-atoms/";
import { WalletContext } from "@/lib/context/WalletContext";

export const TheFooterNavbar = () => {
  const params = useParams();
  const { push } = useRouter();
  const { villagerAttestationCount } = useContext(WalletContext);

  const haveChecked = villagerAttestationCount > 0;

  const canCheckIn =
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
        {haveChecked && (
          <Box
            className={`flex flex-col min-w-16 justify-center items-center py-3 gap-2 border-t ${params.slug == "my-badge" ? "border-[#B1EF42]" : "border-transparent"}`}
            onClick={() => push("/my-badge")}
          >
            <BadgeIcon
              className={`w-5 h-5 text-white ${params.slug == "my-badge" ? "opacity-100" : "opacity-50"}`}
            />
            <Text
              className={`text-slate-50 ${params.slug == "my-badge" ? "opacity-100" : "opacity-50"} text-sm font-medium leading-none`}
            >
              My badges
            </Text>
          </Box>
        )}
        {haveChecked && (
          <Box
            className={`flex flex-col min-w-16 justify-center items-center py-3 gap-2 border-t ${params.slug == "give-badge" ? "border-[#B1EF42]" : "border-transparent"}`}
            onClick={() => push("/give-badge")}
          >
            <HeartIcon
              className={`w-5 h-5 text-white ${params.slug == "give-badge" ? " opacity-100" : "opacity-50"}`}
            />
            <Text
              className={`text-slate-50 ${params.slug == "give-badge" ? "opacity-100" : "opacity-50"} text-sm font-medium leading-none`}
            >
              Give badge
            </Text>
          </Box>
        )}
        {haveChecked && (
          <Box
            className={`flex flex-col min-w-16 justify-center items-center py-3 gap-2 border-t ${params.slug == "share" ? "border-[#B1EF42]" : "border-transparent"}`}
            onClick={() => push("/share")}
          >
            <QrCodeIcon
              className={`w-5 h-5 text-white ${params.slug == "share" ? "opacity-100" : "opacity-50"}`}
            />
            <Text
              className={`text-slate-50 ${params.slug == "share" ? "opacity-100" : "opacity-50"} text-sm font-medium leading-none`}
            >
              Share
            </Text>
          </Box>
        )}
        <Box
          className={`flex flex-col min-w-16 justify-center items-center py-3 gap-2 border-t ${params.slug == "checkout" || params.slug == "checkin" ? "border-[#B1EF42]" : "border-transparent"}`}
          onClick={() => {
            if (canCheckIn === "Check In") push("/checkin");
            if (canCheckIn === "Check Out") push("/checkout");
          }}
        >
          <LogoutIcon
            className={`w-5 h-5 text-white ${params.slug == "checkout" || params.slug == "checkin" ? "opacity-100" : "opacity-50"}`}
          />
          <Text
            className={`text-slate-50 ${params.slug == "checkout" || params.slug == "checkin" ? "opacity-100" : "opacity-50"} text-sm font-medium leading-none`}
          >
            {canCheckIn}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
