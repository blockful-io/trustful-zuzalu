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
import { ZUVILLAGE_BADGE_TITLES } from "@/lib/client/constants";
import { hasRole } from "@/lib/service";
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

    const filteredBadges: string[] = [];
    const promises = ZUVILLAGE_BADGE_TITLES.map(async (badge) => {
      const allowedRoles = badge.allowedRole;
      // There is attestations that can be emitted by more than one role
      for (let i = 0; i < allowedRoles.length; i++) {
        // Check if connected account has the role to give the badge
        if (await hasRole(badge.allowedRole[i] as `0x${string}`, address)) {
          filteredBadges.push(badge.title);
          break;
        }
      }
    });

    await Promise.all(promises);
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
