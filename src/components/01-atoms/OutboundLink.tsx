import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import Link from "next/link";

export const OutboundLinkButton = ({
  label,
  svgClassName = "",
}: {
  label: string;
  svgClassName?: string;
}) => {
  return (
    <Tooltip label={"View on explorer"} hasArrow placement="bottom">
      <Link href={label} target="_blank">
        <ExternalLinkIcon className={svgClassName} />
      </Link>
    </Tooltip>
  );
};
