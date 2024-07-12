export const EAS_CONTRACT_OP = "0x4200000000000000000000000000000000000021";

export const RESOLVER_CONTRACT_OP =
  "0xF988953B76B92f2E15Ee5AFFd0c95925261809a9";

export interface Schemas {
  name: string;
  uid: `0x${string}`;
  data: string;
  revocable: boolean;
  allowedRole: `0x${string}`;
}

export const ZUVILLAGE_SCHEMAS: Schemas[] = [
  {
    name: "ATTEST_MANAGER",
    uid: "0xd130b9591f22bb9653f125ed00ff2d7d88b41d64acfd962365b42fe720c295aa",
    data: "string role",
    revocable: true,
    allowedRole:
      "0x79e553c6f53701daa99614646285e66adb98ff0fcc1ef165dd2718e5c873bee6",
  },
  {
    name: "ATTEST_VILLAGER",
    uid: "0xcb74f95269512c5cb95c9f854a8ec8fe015d453f1bbff52d83ffd894dfec1883",
    data: "string status",
    revocable: false,
    allowedRole:
      "0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08",
  },
  {
    name: "ATTEST_EVENT",
    uid: "0x157df2f42e66b3dc2fd354354cb3d678789b258a8aa5a5493d6c3b75ab003a69",
    data: "string title,string comment",
    revocable: false,
    allowedRole:
      "0x7e8ac59880745312f8754f56b69cccc1c6b2112d567ccf50e4e6dc2e39a7c67a",
  },
  {
    name: "ATTEST_RESPONSE",
    uid: "0x440a07d9a96ab2f16f2e983582f5331bd80c7c9033d57c784c052619b868a9c2",
    data: "string status",
    revocable: true,
    allowedRole:
      "0x7e8ac59880745312f8754f56b69cccc1c6b2112d567ccf50e4e6dc2e39a7c67a",
  },
];

export interface BadgeTitle {
  title: string;
  uid: `0x${string}`;
  allowComment: boolean;
  revocable: boolean;
  data: string;
  allowedRole: `0x${string}`;
}

export const ZUVILLAGE_BADGE_TITLES: BadgeTitle[] = [
  {
    title: "Manager",
    uid: ZUVILLAGE_SCHEMAS[0].uid,
    allowComment: false,
    revocable: true,
    data: ZUVILLAGE_SCHEMAS[0].data,
    allowedRole: ZUVILLAGE_SCHEMAS[0].allowedRole,
  },
  {
    title: "Check-in",
    uid: ZUVILLAGE_SCHEMAS[1].uid,
    allowComment: false,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[1].data,
    allowedRole: ZUVILLAGE_SCHEMAS[1].allowedRole,
  },
  {
    title: "Changed My Mind",
    uid: ZUVILLAGE_SCHEMAS[2].uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[2].data,
    allowedRole: ZUVILLAGE_SCHEMAS[2].allowedRole,
  },
  {
    title: "Is a good person",
    uid: ZUVILLAGE_SCHEMAS[2].uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[2].data,
    allowedRole: ZUVILLAGE_SCHEMAS[2].allowedRole,
  },
  {
    title: "Has a brilliant mind",
    uid: ZUVILLAGE_SCHEMAS[2].uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS[2].data,
    allowedRole: ZUVILLAGE_SCHEMAS[2].allowedRole,
  },
];

export const ALCHEMY_PUBLIC_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/8G0MHGw9nt_PBkot5GcmxLNdQgRaW_DN";
