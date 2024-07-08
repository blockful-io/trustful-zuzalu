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

interface QRCodeContextProps {
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

const defaultContextValue: QRCodeContextProps = {
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

export const QRCodeContext =
  createContext<QRCodeContextProps>(defaultContextValue);

export const QRCodeContextProvider = ({
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

  const QRCodeContextData = useMemo(
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
    <QRCodeContext.Provider value={QRCodeContextData}>
      {children}
    </QRCodeContext.Provider>
  );
};

export const useQRCodeContext = () => {
  const context = React.useContext(QRCodeContext);
  if (context === undefined) {
    throw new Error(
      "useQRCodeContext must be used within a QRCodeContextProvider",
    );
  }
  return context;
};
