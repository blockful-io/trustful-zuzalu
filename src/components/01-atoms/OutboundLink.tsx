import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";

export const OutboundLinkButton = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => {
  return (
    <Tooltip label={"View on explorer"} hasArrow placement="bottom">
      <Link href={label} target="_blank">
        <ExternalLinkIcon className={className} />
      </Link>
    </Tooltip>
  );
};
