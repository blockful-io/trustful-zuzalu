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

import {
  GiveBadgeAction,
  GiveBadgeStepAddress,
} from "@/components/04-templates/GiveBadgeSection";
import { useNotify } from "@/hooks";

import { ZUVILLAGE_BADGE_TITLES } from "../client/constants";
import { hasRole } from "../service/hasRole";
import { EthereumAddress } from "../shared/types";

interface GiveBadgeContextProps {
  badgeInputAddress: EthereumAddress | null;
  setBadgeInputAddress: Dispatch<SetStateAction<EthereumAddress | null>>;
  action: GiveBadgeAction;
  setAction: Dispatch<SetStateAction<GiveBadgeAction>>;
  addressStep: GiveBadgeStepAddress;
  setAddressStep: Dispatch<SetStateAction<GiveBadgeStepAddress>>;
  handleActionChange: (newAction: GiveBadgeAction) => void;
  setQRCodeisOpen: Dispatch<SetStateAction<boolean>>;
  QRCodeIsOpen: boolean;
  inputBadgeTitleList: string[] | null;
  setInputBadgeTitleList: Dispatch<SetStateAction<string[] | null>>;
}

const defaultContextValue: GiveBadgeContextProps = {
  badgeInputAddress: null,
  setBadgeInputAddress: () => {},
  action: GiveBadgeAction.ADDRESS,
  setAction: () => {},
  addressStep: GiveBadgeStepAddress.INSERT_ADDRESS,
  setAddressStep: () => {},
  handleActionChange: () => {},
  setQRCodeisOpen: () => {},
  QRCodeIsOpen: false,
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
  const [action, setAction] = useState<GiveBadgeAction>(
    GiveBadgeAction.ADDRESS,
  );
  const [addressStep, setAddressStep] = useState<GiveBadgeStepAddress>(
    GiveBadgeStepAddress.INSERT_ADDRESS,
  );
  const [QRCodeIsOpen, setQRCodeisOpen] = useState<boolean>(false);
  const [inputBadgeTitleList, setInputBadgeTitleList] = useState<
    string[] | null
  >(null);

  const handleActionChange = (newAction: GiveBadgeAction) => {
    setAction(newAction);
  };

  const [giveBadgeContextData, setGiveBadgeContextData] =
    useState<GiveBadgeContextProps>({
      badgeInputAddress,
      setBadgeInputAddress,
      action,
      setAction,
      addressStep,
      setAddressStep,
      handleActionChange,
      setQRCodeisOpen,
      QRCodeIsOpen,
      inputBadgeTitleList,
      setInputBadgeTitleList,
    });

  useEffect(() => {
    setGiveBadgeContextData({
      badgeInputAddress,
      setBadgeInputAddress,
      action,
      setAction,
      addressStep,
      setAddressStep,
      handleActionChange,
      setQRCodeisOpen,
      QRCodeIsOpen,
      inputBadgeTitleList,
      setInputBadgeTitleList,
    });
  }, [
    badgeInputAddress,
    action,
    addressStep,
    QRCodeIsOpen,
    inputBadgeTitleList,
  ]);

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
