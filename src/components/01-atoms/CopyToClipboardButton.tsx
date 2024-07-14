import { useState } from "react";

import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { useAccount } from "wagmi";

export const CopyToClipboardButton = ({
  isUserAddress = false,
  label,
}: {
  isUserAddress: boolean;
  label?: string;
}) => {
  const { address } = useAccount();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (isUserAddress) {
      navigator.clipboard.writeText(address as `0x${string}`);
    } else if (label) {
      navigator.clipboard.writeText(label);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Revert icon back after 2 seconds
  };
  return (
    <Tooltip label={"Copy to clipboard"} hasArrow placement="bottom">
      {isCopied ? (
        <CheckIcon />
      ) : (
        <CopyIcon onClick={handleCopy} className="cursor-pointer" />
      )}
    </Tooltip>
  );
};
