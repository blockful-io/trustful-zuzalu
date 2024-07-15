import { useState, type ReactNode } from "react";

import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { useAccount } from "wagmi";

interface CopyToClipboardButtonProps {
  isUserAddress?: boolean;
  isShare?: boolean;
  showSvg?: boolean;
  label?: string;
  className?: string;
  svgClassName?: string;
  children?: ReactNode;
}

export const CopyToClipboardButton = ({
  isUserAddress = false,
  isShare = false,
  showSvg = false,
  label,
  className = "",
  svgClassName = "",
  children,
}: CopyToClipboardButtonProps) => {
  const { address } = useAccount();

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const prefixToGiveBadge = "https://trustful.ing/give-badge";
  const linkToGiveBadgeAddress = `${prefixToGiveBadge}?address=${address}`;

  const handleCopy = () => {
    if (isUserAddress) {
      navigator.clipboard.writeText(address as `0x${string}`);
    } else if (label) {
      navigator.clipboard.writeText(label);
    } else if (isShare) {
      navigator.clipboard.writeText(linkToGiveBadgeAddress);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Revert icon back after 2 seconds
  };

  return (
    <Tooltip label={"Copy to clipboard"} hasArrow placement="bottom">
      <div
        onClick={handleCopy}
        className={className}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {children}
        {showSvg && (
          <>
            {isCopied ? (
              <CheckIcon className={svgClassName} />
            ) : (
              <CopyIcon className={svgClassName} />
            )}
          </>
        )}
      </div>
    </Tooltip>
  );
};
