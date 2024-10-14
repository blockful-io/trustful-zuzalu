export const EAS_CONTRACT_SCROLL = "0xC47300428b6AD2c7D03BB76D05A176058b47E6B0";

export const RESOLVER_CONTRACT_SCROLL =
  "0xeD4544F10D347e326140dBB869b6f4120DAf2c7B";

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
    uid: "0x3f7ab1b49d993220e928f71da02745eeeabe5bce53308ba9f47416fe0a0abfc4",
    data: "string role",
    revocable: true,
    allowedRole: [ROLES.ROOT],
  },
  ATTEST_VILLAGER: {
    uid: "0x622181707fd9d196c9212d09db8788e3b46945304a4b9e7cbc55b4e179602a62",
    data: "string status",
    revocable: false,
    allowedRole: [ROLES.MANAGER],
  },
  ATTEST_EVENT: {
    uid: "0xeb6ab1d8bc235579023101a04b1a9e240d4f756e6137b8389e5c54b049ad6972",
    data: "string title,string comment",
    revocable: false,
    allowedRole: [ROLES.VILLAGER],
  },
  ATTEST_RESPONSE: {
    uid: "0x57cb29f73b0ff46e40261932c9a1f5aef91c9098ede3d449f4de7ee43089b988",
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
  "https://scroll-mainnet.g.alchemy.com/v2/jPLttZWzT9-vo0yJD945MbH7QzS8gSd9";
