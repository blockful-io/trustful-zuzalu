export const SESSIONS_SERVER_ENDPOINT =
  "https://hack-georgia-production.up.railway.app";

export const EAS_CONTRACT_OP = "0x4200000000000000000000000000000000000021";

export const RESOLVER_CONTRACT_OP =
  "0x000000000A83e04396e0B5a101BE093625816cb0";

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
    uid: "0xe7ab13111393053093b6c9b7c9e4d938b389f282b6a55d5f476a3831d9c7b963",
    data: "string role",
    revocable: true,
    allowedRole: [ROLES.ROOT],
  },
  ATTEST_VILLAGER: {
    uid: "0x7e7356f449e9238c4b2d2b4ba18a00c7cc1604e5828a8442cf781bd9d625ae32",
    data: "string status",
    revocable: false,
    allowedRole: [ROLES.MANAGER],
  },
  ATTEST_EVENT: {
    uid: "0xa3912c0b67e505ae37ecba65247528d1d2119ce34eee9dcdd916619a9d3463f6",
    data: "string title,string comment",
    revocable: false,
    allowedRole: [ROLES.VILLAGER],
  },
  ATTEST_RESPONSE: {
    uid: "0xdb0dc5f4ee2b90d684d787cd109e526823c80587e8a477c5a8fafd13b6fd9ae1",
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
