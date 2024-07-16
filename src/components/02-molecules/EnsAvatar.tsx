import { Avatar, Box, Image } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

import { useEnsData } from "@/hooks/useEnsData";
import { ENSAvatarQueryStatus } from "@/hooks/useEnsData";
import { EthereumAddress } from "@/lib/shared/types";

const sizeMap = {
  small: 24,
  medium: 48,
  big: 72,
};

interface EnsAvatarProps {
  ensAddress: EthereumAddress | `0x${string}` | null;
  size: "small" | "medium" | "big";
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
            size={size === "small" ? 3 : size === "medium" ? 5 : 8}
            color="#B1EF42"
          />
        </Box>
      ) : (
        <Avatar />
      )}
    </>
  );
};
