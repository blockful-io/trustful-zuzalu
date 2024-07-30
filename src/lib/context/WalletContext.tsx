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

import { watchAccount } from "@wagmi/core";
import { optimism } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";

import { useNotify } from "@/hooks/useNotify";
import { ZUVILLAGE_SCHEMAS, ROLES } from "@/lib/client/constants";
import { VILLAGER_QUERY } from "@/lib/client/schemaQueries";
import { fetchEASData } from "@/lib/service/fetchEASData";
import { hasRole } from "@/lib/service/hasRole";
import { getEllipsedAddress } from "@/utils/formatters";
import { wagmiConfig } from "@/wagmi";

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

  const { address, chainId } = useAccount();
  const { notifyError, notifySuccess } = useNotify();
  const unwatch = watchAccount(wagmiConfig, {
    onChange() {},
  });
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    // First Time user in page
    if (address && villagerAttestationCount === null) {
      handleQuery();
    }
    unwatch();
  }, [address]);

  useEffect(() => {
    // User changes account
    if (address) {
      handleQuery();
      notifySuccess({
        title: "Account Changed",
        message: `Connected to your account ${getEllipsedAddress(address)}`,
      });
    }
    return () => {
      unwatch();
    };
  }, [address]);

  const handleQuery = async () => {
    // If the user is ROOT we skip the checkin validation
    if (address) {
      if (chainId !== optimism.id) {
        notifyError({
          title: "Unsupported network",
          message:
            "Please switch to the Optmism network to use this application.",
        });
        switchChain({ chainId: optimism.id });
        return;
      }
      const isRoot = await hasRole(ROLES.ROOT, address);
      if (isRoot) {
        setVillagerAttestationCount(2);
        return;
      } else {
        const isManager = await hasRole(ROLES.MANAGER, address);
        if (isManager) {
          setVillagerAttestationCount(2);
          return;
        }
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
