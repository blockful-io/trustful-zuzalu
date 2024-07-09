export enum DeployedAddresses {
  OPSEPOLIA_TRUSTFUL_RESOLVER = "OPSEPOLIA_TRUSTFUL_RESOLVER",
  OPTIMISM_TRUSTFUL_RESOLVER = "OPTIMISM_TRUSTFUL_RESOLVER",
  OPTIMISM_EAS = "OPTIMISM_EAS",
  OPTIMISM_REGISTRY = "OPTIMISM_REGISTRY",
  OPTIMISM_SEPOLIA_EAS = "OPTIMISM_SEPOLIA_EAS",
  OPTIMISM_SEPOLIA_REGISTRY = "OPTIMISM_SEPOLIA_REGISTRY",
}

interface ChainProps {
  id: number;
  name: string;
}

export const ChainInfo: Record<DeployedAddresses, ChainProps> = {
  [DeployedAddresses.OPTIMISM_TRUSTFUL_RESOLVER]: {
    id: 10,
    name: "Optimism",
  },
  [DeployedAddresses.OPTIMISM_EAS]: {
    id: 10,
    name: "Optimism",
  },
  [DeployedAddresses.OPTIMISM_REGISTRY]: {
    id: 10,
    name: "Optimism",
  },
  [DeployedAddresses.OPSEPOLIA_TRUSTFUL_RESOLVER]: {
    id: 11155420,
    name: "Optimism Sepolia",
  },
  [DeployedAddresses.OPTIMISM_SEPOLIA_EAS]: {
    id: 11155420,
    name: "Optimism Sepolia",
  },
  [DeployedAddresses.OPTIMISM_SEPOLIA_REGISTRY]: {
    id: 11155420,
    name: "Optimism Sepolia",
  },
};

export const TRUSTFUL_SMART_CONTRACT_ADDRESS = {
  [ChainInfo.OPTIMISM_TRUSTFUL_RESOLVER.id]: "0X123...",
  [ChainInfo.OPTIMISM_EAS.id]: "0x4200000000000000000000000000000000000021",
  [ChainInfo.OPTIMISM_REGISTRY.id]:
    " 0x4200000000000000000000000000000000000020",
  [ChainInfo.OPSEPOLIA_TRUSTFUL_RESOLVER.id]: "0X123...",
  [ChainInfo.OPTIMISM_SEPOLIA_EAS.id]:
    "0x4200000000000000000000000000000000000021",
  [ChainInfo.OPTIMISM_SEPOLIA_REGISTRY.id]:
    "0x4200000000000000000000000000000000000020",
};

export interface Schemas {
  schemaName: string;
  schemaUID: `0x${string}`;
}

export const ALCHEMY_PUBLIC_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/8G0MHGw9nt_PBkot5GcmxLNdQgRaW_DN";
