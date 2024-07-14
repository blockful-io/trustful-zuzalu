/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useContext,
} from "react";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { useNotify } from "@/hooks/useNotify";
import { fetchEASData } from "@/lib/service/fetchEASData";
import { hasRole } from "@/lib/service/hasRole";

import { ZUVILLAGE_SCHEMAS, ROLES } from "../client/constants";
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

  const [walletContextData, setWalletContextData] =
    useState<WalletContextProps>({
      villagerAttestationCount,
      setVillagerAttestationCount,
    });

  useEffect(() => {
    setWalletContextData({
      villagerAttestationCount,
      setVillagerAttestationCount,
    });
  }, [villagerAttestationCount]);

  const { address } = useAccount();
  const { push } = useRouter();
  const { notifyError } = useNotify();

  useEffect(() => {
    if (address && villagerAttestationCount === null) {
      handleQuery();
    }
  }, [address]);

  useEffect(() => {
    if (villagerAttestationCount === 0) {
      push("/pre-checkin");
    }

    // if (villagerAttestationCount && villagerAttestationCount > 0) {
    //   push("/my-badge");
    // }
  }, [villagerAttestationCount]);

  const handleQuery = async () => {
    // If the user is ROOT we skip the checkin validation
    if (address) {
      const isRoot = await hasRole(ROLES.ROOT, address);
      if (isRoot) {
        setVillagerAttestationCount(2);
        return;
      }
    }

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

    if (address) {
      const isRoot = await hasRole(ROLES.ROOT, address);
      if (isRoot) {
        setVillagerAttestationCount(2);
      } else {
        setVillagerAttestationCount(response.data.data.attestations.length);
      }
    }

    setVillagerAttestationCount(response.data.data.attestations.length);
  };

  return (
    <WalletContext.Provider value={walletContextData}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error(
      "useWalletContext must be used within a WalletContextProvider",
    );
  }
  return context;
};
