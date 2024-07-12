import React, {
  createContext,
  useState,
  useMemo,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  GiveBadgeAction,
  GiveBadgeStepAddress,
} from "@/components/04-templates/GiveBadgeSection";

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

  const handleActionChange = (newAction: GiveBadgeAction) => {
    setAction(newAction);
  };

  const GiveBadgeContextData = useMemo(
    () => ({
      badgeInputAddress,
      setBadgeInputAddress,
      action,
      setAction,
      addressStep,
      setAddressStep,
      handleActionChange,
      setQRCodeisOpen,
      QRCodeIsOpen,
    }),
    [badgeInputAddress, action, addressStep, QRCodeIsOpen],
  );

  return (
    <GiveBadgeContext.Provider value={GiveBadgeContextData}>
      {children}
    </GiveBadgeContext.Provider>
  );
};

export const useGiveBadgeContext = () => {
  const context = React.useContext(GiveBadgeContext);
  if (context === undefined) {
    throw new Error(
      "useGiveBadgeContext must be used within a GiveBadgeContextProvider",
    );
  }
  return context;
};
