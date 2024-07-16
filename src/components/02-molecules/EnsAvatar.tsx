import { Avatar, Box, Image } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

import { useEnsData } from "@/hooks/useEnsData";
import { ENSAvatarQueryStatus } from "@/hooks/useEnsData";
import { EthereumAddress } from "@/lib/shared/types";

const sizeMap = {
  xxs: 16,
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 72,
  xxl: 128,
  full: "100%",
};

const chakraAvatarMap = {
  xxs: "2xs",
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  xxl: "2xl",
  full: "100%",
};

interface EnsAvatarProps {
  ensAddress: EthereumAddress | `0x${string}` | null;
  size: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full";
}

export const EnsAvatar = ({ ensAddress, size }: EnsAvatarProps) => {
  if (typeof ensAddress === "string") {
    ensAddress = new EthereumAddress(ensAddress);
  }

  const dimension = sizeMap[size];

  const { avatarQueryStatus, avatarSrc } = useEnsData({
    ensAddress: ensAddress,
  });

  return (
    <>
      {avatarQueryStatus === ENSAvatarQueryStatus.SUCCESS && avatarSrc ? (
        <Box
          width={`${dimension}px`}
          height={`${dimension}px`}
          borderRadius="50%"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.200"
        >
          <Image
            src={avatarSrc}
            alt="Avatar"
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
      ) : avatarQueryStatus === ENSAvatarQueryStatus.LOADING ? (
        <Box
          width={`${sizeMap[size]}px`}
          height={`${sizeMap[size]}px`}
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="#F5FFFF0D"
        >
          <BeatLoader
            size={
              size === "lg" ||
              size === "xl" ||
              size === "xxl" ||
              size === "full"
                ? 8
                : size === "md" || size === "sm"
                  ? 5
                  : 3
            }
            color="#B1EF42"
          />
        </Box>
      ) : (
        <Avatar size={chakraAvatarMap[size]} />
      )}
    </>
  );
};
