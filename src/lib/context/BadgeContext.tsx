// BadgeContext.tsx
import type { BadgeStatus } from "@/components/01-atoms";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface Schema {
  index: string;
  id: string;
}

// Defina os tipos no mesmo arquivo
interface Badge {
  id: string;
  title: string;
  status: BadgeStatus;
  comment: string;
  timeCreated: number;
  attester: string;
  recipient: string;
  txid: string;
  schema: Schema;
}

interface BadgeContextType {
  selectedBadge: Badge | null;
  setSelectedBadge: Dispatch<SetStateAction<Badge | null>>;
}

const defaultContextValue: BadgeContextType = {
  selectedBadge: null,
  setSelectedBadge: () => {},
};

const BadgeContext = createContext<BadgeContextType>(defaultContextValue);

interface BadgeProviderProps {
  children: ReactNode;
}

export const BadgeContextProvider: React.FC<BadgeProviderProps> = ({
  children,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const BadgeContextData = useMemo(
    () => ({
      selectedBadge,
      setSelectedBadge,
    }),
    [selectedBadge],
  );

  return (
    <BadgeContext.Provider value={BadgeContextData}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadge = (): BadgeContextType => {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error("useBadge must be used within a BadgeProvider");
  }
  return context;
};
