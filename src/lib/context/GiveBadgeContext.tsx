import React, {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
} from "react";

import { useAccount } from "wagmi";

import { GiveBadgeStepAddress } from "@/components/04-templates/GiveBadgeSection";
import { useNotify } from "@/hooks";
import { ZUVILLAGE_SCHEMAS } from "@/lib/client/constants";
import { hasRole, getAllAttestationTitles } from "@/lib/service";
import { EthereumAddress } from "@/lib/shared/types";

interface GiveBadgeContextProps {
  badgeInputAddress: EthereumAddress | null;
  setBadgeInputAddress: Dispatch<SetStateAction<EthereumAddress | null>>;
  addressStep: GiveBadgeStepAddress;
  setAddressStep: Dispatch<SetStateAction<GiveBadgeStepAddress>>;
  inputBadgeTitleList: string[] | null;
  setInputBadgeTitleList: Dispatch<SetStateAction<string[] | null>>;
}

const defaultContextValue: GiveBadgeContextProps = {
  badgeInputAddress: null,
  setBadgeInputAddress: () => {},
  addressStep: GiveBadgeStepAddress.INSERT_ADDRESS,
  setAddressStep: () => {},
  inputBadgeTitleList: null,
  setInputBadgeTitleList: () => {},
};

export const GiveBadgeContext =
  createContext<GiveBadgeContextProps>(defaultContextValue);

export const GiveBadgeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [badgeInputAddress, setBadgeInputAddress] =
    useState<EthereumAddress | null>(null);
  const [addressStep, setAddressStep] = useState<GiveBadgeStepAddress>(
    GiveBadgeStepAddress.INSERT_ADDRESS,
  );
  const [inputBadgeTitleList, setInputBadgeTitleList] = useState<
    string[] | null
  >(null);

  const [giveBadgeContextData, setGiveBadgeContextData] =
    useState<GiveBadgeContextProps>({
      badgeInputAddress,
      setBadgeInputAddress,
      addressStep,
      setAddressStep,
      inputBadgeTitleList,
      setInputBadgeTitleList,
    });

  useEffect(() => {
    setGiveBadgeContextData({
      badgeInputAddress,
      setBadgeInputAddress,
      addressStep,
      setAddressStep,
      inputBadgeTitleList,
      setInputBadgeTitleList,
    });
  }, [badgeInputAddress, addressStep, inputBadgeTitleList]);

  const { address } = useAccount();
  const { notifyError } = useNotify();

  useEffect(() => {
    if (address) {
      handleBadgeDropdown();
    }
  }, [address]);

  const handleBadgeDropdown = async () => {
    if (!address) {
      notifyError({
        title: "No account connected",
        message: "Please connect your wallet.",
      });
      return;
    }

    const filteredBadges: string[] | Error = await getAllAttestationTitles();

    if (filteredBadges instanceof Error || !filteredBadges) {
      notifyError({
        title: "Error Read Contract",
        message: "Error while reading badge titles from the blockchain.",
      });
      return;
    }

    if (
      await hasRole(
        ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.allowedRole[0] as `0x${string}`,
        address,
      )
    ) {
      filteredBadges.push("Manager");
    }

    if (
      await hasRole(
        ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.allowedRole[0] as `0x${string}`,
        address,
      )
    ) {
      filteredBadges.push("Check-in");
      filteredBadges.push("Check-out");
    }

    await Promise.all(filteredBadges);
    setInputBadgeTitleList(filteredBadges.sort());
  };

  return (
    <GiveBadgeContext.Provider value={giveBadgeContextData}>
      {children}
    </GiveBadgeContext.Provider>
  );
};

export const useGiveBadgeContext = () => {
  const context = useContext(GiveBadgeContext);
  if (context === undefined) {
    throw new Error(
      "useGiveBadgeContext must be used within a GiveBadgeContextProvider",
    );
  }
  return context;
};
