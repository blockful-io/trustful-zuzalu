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
  villagerAttestationCount: number | null;
  setVillagerAttestationCount: Dispatch<SetStateAction<number | null>>;
}

const defaultContextValue: WalletContextProps = {
  villagerAttestationCount: null,
  setVillagerAttestationCount: () => {},
};

export const WalletContext =
  createContext<WalletContextProps>(defaultContextValue);

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Using 3 as a default value, meaning no operation has been done yet
  const [villagerAttestationCount, setVillagerAttestationCount] = useState<
    number | null
  >(null);

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
    if (address && villagerAttestationCount === null) {
      handleQuery();
    } else {
      push("/");
    }
  }, [address]);

  useEffect(() => {
    if (villagerAttestationCount === 0) {
      push("/pre-checkin");
    }

    if (villagerAttestationCount && villagerAttestationCount > 0) {
      push("/my-badge");
    }
  }, [villagerAttestationCount]);

  const handleQuery = async () => {
    const queryVariables = {
      where: {
        schemaId: {
          equals: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid,
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
