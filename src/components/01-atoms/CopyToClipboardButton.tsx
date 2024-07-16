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
  className = "",
  svgClassName = "",
  label,
  children,
}: CopyToClipboardButtonProps) => {
  const { address } = useAccount();

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
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
    setTimeout(() => {
      setIsCopied(false);
      setIsVisible(false);
    }, 2000); // Revert icon back after 2 seconds
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isCopied) {
      setIsVisible(false);
    }
  };

  return (
    <>
      {showSvg ? (
        <Tooltip
          label={"Copy to clipboard"}
          backgroundColor={"#B1EF42"}
          color={"black"}
          fontSize={"12px"}
          hasArrow
          placement="bottom"
        >
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
      ) : (
        <Tooltip
          label={isCopied ? "Copied!" : "Copy to clipboard"}
          backgroundColor={"#B1EF42"}
          color={"black"}
          fontSize={"12px"}
          hasArrow
          placement="bottom"
          closeOnClick={false}
          isOpen={isVisible}
        >
          <div
            onClick={handleCopy}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={className}
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {children}
          </div>
        </Tooltip>
      )}
    </>
  );
};
