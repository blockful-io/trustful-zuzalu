import { useEffect, useState } from "react";

import { useEnsName } from "wagmi";

import { EthereumAddress } from "@/lib/shared/types";

export enum ENSAvatarQueryStatus {
  LOADING,
  SUCCESS,
  ERROR,
}

interface Props {
  ensAddress: EthereumAddress | null;
}

export const useEnsData = ({ ensAddress }: Props) => {
  const ensname = useEnsName({
    address: ensAddress?.address,
    chainId: 1,
  });

  const [primaryName, setPrimaryName] = useState<string | null | undefined>(
    undefined,
  );
  const [avatarQueryStatus, setAvatarQueryStatus] =
    useState<ENSAvatarQueryStatus>(ENSAvatarQueryStatus.LOADING);

  useEffect(() => {
    if (ensname.isSuccess) {
      setAvatarQueryStatus(ENSAvatarQueryStatus.SUCCESS);
      setPrimaryName(ensname.data);
    } else if (ensname.isError) {
      setAvatarQueryStatus(ENSAvatarQueryStatus.ERROR);
      setPrimaryName(null);
    } else if (ensname.isLoading || ensname.isFetching) {
      setAvatarQueryStatus(ENSAvatarQueryStatus.LOADING);
      setPrimaryName(null);
    }
    console.log(avatarQueryStatus, primaryName, ensname.data);
  }, [ensname]);

  return {
    primaryName,
    avatarQueryStatus: avatarQueryStatus,
    avatarSrc: primaryName
      ? `https://metadata.ens.domains/mainnet/avatar/${primaryName}`
      : null,
  };
};
