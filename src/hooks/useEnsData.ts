import { useEffect, useState } from "react";

import { useEnsName } from "wagmi";

import { ENS_REVERSE_QUERY } from "@/lib/client/schemaQueries";
import { fetchENSData } from "@/lib/service";
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

  const emergencyEnsPrimaryName = async () => {
    const queryVariables = {
      address: ensAddress?.address,
    };
    const { response, success } = await fetchENSData(
      ENS_REVERSE_QUERY,
      queryVariables,
    );

    if (
      !success ||
      response === null ||
      response === undefined ||
      response.data.data.domains.length === 0
    ) {
      setAvatarQueryStatus(ENSAvatarQueryStatus.ERROR);
      setPrimaryName(null);
      return;
    }

    const name = response.data.data.domains[0].name;
    setPrimaryName(name);
    setAvatarQueryStatus(ENSAvatarQueryStatus.SUCCESS);
  };

  useEffect(() => {
    if (ensname.isSuccess) {
      setAvatarQueryStatus(ENSAvatarQueryStatus.SUCCESS);
      setPrimaryName(ensname.data);
    } else {
      emergencyEnsPrimaryName();
    }
    // } else if (ensname.isError) {
    //   emergencyEnsPrimaryName();
    // } else if (ensname.isLoading || ensname.isFetching) {
    //   setAvatarQueryStatus(ENSAvatarQueryStatus.LOADING);
    //   setPrimaryName(null);
    // }
  }, [ensname]);

  return {
    primaryName,
    avatarQueryStatus: avatarQueryStatus,
    avatarSrc: primaryName
      ? `https://metadata.ens.domains/mainnet/avatar/${primaryName}`
      : null,
  };
};
