import React, {
  createContext,
  useState,
  useMemo,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { useNotify } from "@/hooks/useNotify";
import { fetchEASData } from "@/lib/service/fetchEASData";

import { ZUVILLAGE_SCHEMAS } from "../client/constants";
import { VILLAGER_QUERY } from "../client/schemaQueries";

interface WalletContextProps {
  villagerAttestationCount: number;
  setVillagerAttestationCount: Dispatch<SetStateAction<number>>;
}

const defaultContextValue: WalletContextProps = {
  villagerAttestationCount: 0,
  setVillagerAttestationCount: () => {},
};

export const WalletContext =
  createContext<WalletContextProps>(defaultContextValue);

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [villagerAttestationCount, setVillagerAttestationCount] =
    useState<number>(0);

  const WalletContextData = useMemo(
    () => ({
      villagerAttestationCount,
      setVillagerAttestationCount,
    }),
    [villagerAttestationCount],
  );

  const { address } = useAccount();
  const { push } = useRouter();
  const { notifyError } = useNotify();
  useEffect(() => {
    if (address && villagerAttestationCount === 0) {
      handleQuery();
    } else {
      push("/");
    }
  }, [address]);

  const handleQuery = async () => {
    const queryVariables = {
      where: {
        schemaId: {
          equals: ZUVILLAGE_SCHEMAS[1].uid,
        },
        recipient: {
          equals: address,
        },
      },
    };

    const { response, success } = await fetchEASData(
      VILLAGER_QUERY,
      queryVariables,
    );

    if (!success) {
      notifyError({
        title: "Cannot fetch EAS",
        message: "Error while fetching Attestation data from Subgraphs",
      });
      return;
    }

    if (response === null) {
      notifyError({
        title: "Cannot fetch EAS",
        message: "Subgraph returned error with current query",
      });
      return;
    }

    setVillagerAttestationCount(response.data.data.attestations.length);
  };

  return (
    <WalletContext.Provider value={WalletContextData}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = React.useContext(WalletContext);
  if (context === undefined) {
    throw new Error(
      "useWalletContext must be used within a WalletContextProvider",
    );
  }
  return context;
};
