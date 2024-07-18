export const EAS_CONTRACT_OP = "0x4200000000000000000000000000000000000021";

export const RESOLVER_CONTRACT_OP =
  "0x9fDFfD6509931048d017a8E43BA80E5B6fb2BcA7";

export enum ROLES {
  ROOT = "0x79e553c6f53701daa99614646285e66adb98ff0fcc1ef165dd2718e5c873bee6",
  MANAGER = "0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08",
  VILLAGER = "0x7e8ac59880745312f8754f56b69cccc1c6b2112d567ccf50e4e6dc2e39a7c67a",
}

export interface Schemas {
  uid: `0x${string}`;
  data: string;
  revocable: boolean;
  allowedRole: string[];
}

export const ZUVILLAGE_SCHEMAS: { [key: string]: Schemas } = {
  ATTEST_MANAGER: {
    uid: "0x5c05a1155bf460df23ebbb24d7c6655f3a5a040f09cfeb4f86e908fe76f83ff5",
    data: "string role",
    revocable: true,
    allowedRole: [ROLES.ROOT],
  },
  ATTEST_VILLAGER: {
    uid: "0x314a110301e8b29925afda069e66cc9b1506788e0872930a2e6d1b173472ada6",
    data: "string status",
    revocable: false,
    allowedRole: [ROLES.MANAGER],
  },
  ATTEST_EVENT: {
    uid: "0xafd227d3360e73358a503cf7783c105607ada7604ac109078fac57c3d6ba29cb",
    data: "string title,string comment",
    revocable: false,
    allowedRole: [ROLES.VILLAGER],
  },
  ATTEST_RESPONSE: {
    uid: "0x1cb84685278216ede7655866e5a85158e1c8eb4b0ff49bb41f845b5386aef9ea",
    data: "bool status",
    revocable: true,
    allowedRole: [ROLES.VILLAGER],
  },
};

export interface BadgeTitle {
  title: string;
  uid: `0x${string}`;
  allowComment: boolean;
  revocable: boolean;
  data: string;
  allowedRole: string[];
}

export const ZUVILLAGE_BADGE_TITLES: BadgeTitle[] = [
  {
    title: "Manager",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.uid,
    allowComment: false,
    revocable: true,
    data: ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_MANAGER.allowedRole,
  },
  {
    title: "Check-in",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid,
    allowComment: false,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.allowedRole,
  },
  {
    title: "Check-out",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.allowedRole,
  },
];

export const ALCHEMY_PUBLIC_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/8G0MHGw9nt_PBkot5GcmxLNdQgRaW_DN";
