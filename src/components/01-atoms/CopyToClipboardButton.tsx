import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";

export const CopyToClipboardButton = () => {
  const { address } = useAccount();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address as `0x${string}`);
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
