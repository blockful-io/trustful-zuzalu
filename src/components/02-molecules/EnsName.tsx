import { Flex, Text } from "@chakra-ui/react";

import { CopyToClipboardButton } from "@/components/01-atoms";
import { useEnsData } from "@/hooks/useEnsData";
import { EthereumAddress } from "@/lib/shared/types";
import { getEllipsedAddress } from "@/utils/formatters";

import { OutboundLinkButton } from "../01-atoms/OutboundLink";

interface EnsNameProps {
  ensAddress: EthereumAddress | `0x${string}` | null;
  copyToClipboard?: boolean;
  showClipboardSvg?: boolean;
  customClassName?: boolean;
  clipboardClassName?: string;
  externalLink?: boolean;
}

export const EnsName = ({
  ensAddress,
  copyToClipboard = false,
  showClipboardSvg = false,
  customClassName = false,
  clipboardClassName = "",
  externalLink = false,
}: EnsNameProps) => {
  if (typeof ensAddress === "string") {
    ensAddress = new EthereumAddress(ensAddress);
  }

  const { primaryName } = useEnsData({
    ensAddress: ensAddress,
  });

  return (
    <Flex gap={4} justifyContent="start" alignItems="center">
      <Text
        className={
          customClassName
            ? clipboardClassName
            : "text-slate-50 opacity-70 text-sm font-normal leading-tight"
        }
      >
        {copyToClipboard ? (
          <CopyToClipboardButton
            showSvg={showClipboardSvg}
            label={ensAddress?.address}
            svgClassName={showClipboardSvg ? "ml-1" : ""}
          >
            {primaryName
              ? primaryName
              : getEllipsedAddress(ensAddress?.address)}
          </CopyToClipboardButton>
        ) : (
          <>
            {primaryName
              ? primaryName
              : getEllipsedAddress(ensAddress?.address)}
          </>
        )}
        {externalLink && (
          <OutboundLinkButton
            label={`https://scrollscan.com/address/${ensAddress?.address}`}
            svgClassName="cursor-pointer text-center ml-1"
          />
        )}
      </Text>
    </Flex>
  );
};
