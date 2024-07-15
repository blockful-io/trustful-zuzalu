import { ROLES } from "@/lib/client/constants";

enum ROLES_NAME {
  ROOT = "ROOT",
  MANAGER = "MANAGER",
  VILLAGER = "VILLAGER",
}

export enum ActionName {
  NONE = "NONE", // 0
  ASSIGN_MANAGER = "ASSIGN_MANAGER", // 1
  ASSIGN_VILLAGER = "ASSIGN_VILLAGER", // 2
  ATTEST = "ATTEST", // 3
  REPLY = "REPLY", // 4
}

export const ROLES_OPTIONS: Record<ROLES_NAME, ROLES> = {
  ROOT: ROLES.ROOT,
  MANAGER: ROLES.MANAGER,
  VILLAGER: ROLES.VILLAGER,
};

export const ACTIONS_OPTIONS: Record<ActionName, number> = {
  NONE: 0,
  ASSIGN_MANAGER: 1,
  ASSIGN_VILLAGER: 2,
  ATTEST: 3,
  REPLY: 4,
};

export enum ADMIN_ACTION {
  GRANT_ROLE = "Grant Role",
  REVOKE_ROLE = "Revoke Role",
  REVOKE_MANAGER = "Revoke Manager",
  SET_ATTESTATION_TITLE = "Create Badge",
  SET_SCHEMA = "Set Schema Action",
}

export interface AdminActions {
  action: ADMIN_ACTION;
}

export const ADMIN_OPTIONS: AdminActions[] = [
  {
    action: ADMIN_ACTION.GRANT_ROLE,
  },
  {
    action: ADMIN_ACTION.REVOKE_ROLE,
  },
  {
    action: ADMIN_ACTION.REVOKE_MANAGER,
  },
  {
    action: ADMIN_ACTION.SET_ATTESTATION_TITLE,
  },
  {
    action: ADMIN_ACTION.SET_SCHEMA,
  },
];

export const MANAGER_OPTIONS: AdminActions[] = [
  {
    action: ADMIN_ACTION.REVOKE_MANAGER,
  },
  {
    action: ADMIN_ACTION.SET_ATTESTATION_TITLE,
  },
];
