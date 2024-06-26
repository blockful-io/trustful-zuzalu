import { type FC } from "react";

import { useAccount } from "wagmi";

import { InfoText } from "@/components/01-atoms";

export const Chain: FC = (): JSX.Element => {
  const { chain } = useAccount();

  const chainInfo = `${chain?.name} (${chain?.id})`;

  return <InfoText label="Chain" value={chainInfo} />;
};
