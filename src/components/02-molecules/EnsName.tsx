import { Flex, Text } from "@chakra-ui/react";

import { CopyToClipboardButton } from "@/components/01-atoms";
import { useEnsData } from "@/hooks/useEnsData";
import { EthereumAddress } from "@/lib/shared/types";
import { getEllipsedAddress } from "@/utils/formatters";

import { OutboundLinkButton } from "../01-atoms/OutboundLink";

interface EnsNameProps {
  ensAddress: EthereumAddress | `0x${string}` | null;
}

export const EnsName = ({ ensAddress }: EnsNameProps) => {
  if (typeof ensAddress === "string") {
    ensAddress = new EthereumAddress(ensAddress);
  }

  const { primaryName } = useEnsData({
    ensAddress: ensAddress,
  });

  return (
    <Flex gap={4} justifyContent="start" alignItems="center">
      <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
        <CopyToClipboardButton
          label={ensAddress?.address}
          isUserAddress={false}
        >
          {primaryName ? primaryName : getEllipsedAddress(ensAddress?.address)}
        </CopyToClipboardButton>
        <OutboundLinkButton
          label={`https://optimistic.etherscan.io/address/${ensAddress?.address}`}
          className="cursor-pointer text-center ml-1"
        />
      </Text>
    </Flex>
  );
};
