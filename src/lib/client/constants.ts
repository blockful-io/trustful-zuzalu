export const EAS_CONTRACT_OP = "0x4200000000000000000000000000000000000021";

export const RESOLVER_CONTRACT_OP =
  "0x4c385Bf95BbcF34fbDf3320b363a4eb0799886Cc";

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
    uid: "0x7e84e2b90ff7e288a3ba134d64c35c3d093624ccff1d84a4a60a556c19fb27da",
    data: "string role",
    revocable: true,
    allowedRole: [ROLES.ROOT],
  },
  ATTEST_VILLAGER: {
    uid: "0x2b85bd1271fc0ca2c23f162bd7726688a4cc1f8ef57bbe2b8c4b24c2d6c3f1ee",
    data: "string status",
    revocable: false,
    allowedRole: [ROLES.MANAGER],
  },
  ATTEST_EVENT: {
    uid: "0xce1a0c6a7e3412f5cb2c36a8148510944131aada27d9cf98b789f4fd42cf1bee",
    data: "string title,string comment",
    revocable: false,
    allowedRole: [ROLES.VILLAGER],
  },
  ATTEST_RESPONSE: {
    uid: "0x121dafbe9211e471f0d73e35f489e7e936f451ce858e7f74ea0fe48c9b702fdb",
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
    allowComment: false,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_VILLAGER.allowedRole,
  },
  {
    title: "Changed my mind",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Disagreed with somebody on stage",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Created session on Zuzalu city",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Wrote on Zuzagora",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Voted on significant poll",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Early contributor",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Volunteered",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Started a new club",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Hosted a discussion",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Friend from past Zu Events",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Showed me a cool tech",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Showed me around town",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
  {
    title: "Good laughs",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },

  {
    title: "Good talk",
    uid: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.uid,
    allowComment: true,
    revocable: false,
    data: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.data,
    allowedRole: ZUVILLAGE_SCHEMAS.ATTEST_EVENT.allowedRole,
  },
];

export const ALCHEMY_PUBLIC_RPC =
  "https://opt-mainnet.g.alchemy.com/v2/8G0MHGw9nt_PBkot5GcmxLNdQgRaW_DN";
