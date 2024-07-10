import { type FC } from "react";

import { useAccount, useEnsName } from "wagmi";

import { InfoText } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";
import { getEllipsedAddress } from "@/utils/formatters";

export const Address: FC = (): JSX.Element => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { isTablet } = useWindowSize();

  const displayedAddress =
    isTablet && address ? getEllipsedAddress(address, 4) : address;

  return <InfoText value={ensName ?? displayedAddress} />;
};
