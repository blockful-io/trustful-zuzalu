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

export const TRUSTFUL_CONTRACT_ADDRESSES = {
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
  name: string;
  uid: `0x${string}`;
  data: string;
  revocable: boolean;
}

export const ZUVILLAGE_SCHEMAS: Schemas[] = [
  {
    name: "ATTEST_MANAGER",
    uid: "0xd130b9591f22bb9653f125ed00ff2d7d88b41d64acfd962365b42fe720c295aa",
    data: "string role",
    revocable: true,
  },
  {
    name: "ATTEST_VILLAGER",
    uid: "0xcb74f95269512c5cb95c9f854a8ec8fe015d453f1bbff52d83ffd894dfec1883",
    data: "string status",
    revocable: false,
  },
  {
    name: "ATTEST_EVENT",
    uid: "0x157df2f42e66b3dc2fd354354cb3d678789b258a8aa5a5493d6c3b75ab003a69",
    data: "string title,string comment",
    revocable: false,
  },
  {
    name: "ATTEST_RESPONSE",
    uid: "0x440a07d9a96ab2f16f2e983582f5331bd80c7c9033d57c784c052619b868a9c2",
    data: "string status",
    revocable: true,
  },
];

export interface BadgeTitle {
  title: string;
  uid: `0x${string}`;
  allowComment: boolean;
  revocable: boolean;
  data: string;
}

export const ZUVILLAGE_BADGE_TITLES: BadgeTitle[] = [
  {
    title: "Give Manager Badge",
    uid: ZUVILLAGE_SCHEMAS[0].uid,
    allowComment: false,
    revocable: true,
    data: ZUVILLAGE_SCHEMAS[0].data,
  },
  {
    title: "Check-in Villager",
    uid: ZUVILLAGE_SCHEMAS[1].uid,
    allowComment: false,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[1].data,
  },
  {
    title: "Changed My Mind",
    uid: ZUVILLAGE_SCHEMAS[2].uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[2].data,
  },
  {
    title: "Is a good person",
    uid: ZUVILLAGE_SCHEMAS[2].uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[2].data,
  },
  {
    title: "Has a brilliant mind",
    uid: ZUVILLAGE_SCHEMAS[2].uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[2].data,
  },
];

export const ALCHEMY_PUBLIC_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/8G0MHGw9nt_PBkot5GcmxLNdQgRaW_DN";
