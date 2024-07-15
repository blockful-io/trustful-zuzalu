import { useState } from "react";

import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";

export const PasteToClipboardButton = ({
  onPaste,
}: {
  onPaste: (text: string) => void;
}) => {
  const [paste, setPaste] = useState<boolean>(false);

  const handleCopy = async () => {
    const text = await navigator.clipboard.readText();
    setPaste(true);
    setTimeout(() => setPaste(false), 2000);
    onPaste(text);
  };

  return (
    <Tooltip label={"Paste to clipboard"} hasArrow placement="bottom">
      {paste ? (
        <CheckIcon />
      ) : (
        <CopyIcon onClick={handleCopy} className="cursor-pointer" />
      )}
    </Tooltip>
  );
};
