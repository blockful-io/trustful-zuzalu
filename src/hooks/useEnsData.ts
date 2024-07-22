import { useEffect, useState } from "react";

import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { EthereumAddress } from "@/lib/shared/types";

const rpcUrl = process.env.ALCHEMY_RPC_URL;
console.log("rpc url", rpcUrl);
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(rpcUrl),
});

export enum ENSAvatarQueryStatus {
  LOADING,
  SUCCESS,
  ERROR,
}

interface Props {
  ensAddress: EthereumAddress | null;
}

export const useEnsData = ({ ensAddress }: Props) => {
  const [primaryName, setPrimaryName] = useState<string | null | undefined>(
    undefined,
  );
  const [avatarQueryStatus, setAvatarQueryStatus] =
    useState<ENSAvatarQueryStatus>(ENSAvatarQueryStatus.LOADING);

  const getEnsName = async () => {
    if (!ensAddress) {
      return;
    }

    const name = await publicClient.getEnsName({
      address: ensAddress?.address,
    });

    setPrimaryName(name);
    setAvatarQueryStatus(ENSAvatarQueryStatus.SUCCESS);
  };

  useEffect(() => {
    if (ensAddress) {
      getEnsName();
    }
  }, []);

  return {
    primaryName,
    avatarQueryStatus: avatarQueryStatus,
    avatarSrc: primaryName
      ? `https://metadata.ens.domains/mainnet/avatar/${primaryName}`
      : null,
  };
};
