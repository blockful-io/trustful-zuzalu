import { ROLES } from "@/lib/client/constants";

enum ROLES_NAME {
  ROOT = "ROOT",
  MANAGER = "MANAGER",
  VILLAGER = "VILLAGER",
}

export const ROLES_OPTIONS: Record<ROLES_NAME, ROLES> = {
  ROOT: ROLES.ROOT,
  MANAGER: ROLES.MANAGER,
  VILLAGER: ROLES.VILLAGER,
};

export enum ADMIN_ACTION {
  GRANT_ROLE = "GRANT_ROLE",
  REVOKE_ROLE = "REVOKE_ROLE",
  SET_ATTESTATION_TITLE = "SET_ATTESTATION_TITLE",
  SET_SCHEMA = "SET_SCHEMA",
}

export interface AdminActions {
  action: ADMIN_ACTION;
  allowComment: boolean;
  allowChangeRole: boolean;
}

export const ADMIN_OPTIONS: AdminActions[] = [
  {
    action: ADMIN_ACTION.GRANT_ROLE,
    allowComment: false,
    allowChangeRole: true,
  },
  {
    action: ADMIN_ACTION.REVOKE_ROLE,
    allowComment: false,
    allowChangeRole: true,
  },
  {
    action: ADMIN_ACTION.SET_ATTESTATION_TITLE,
    allowComment: false,
    allowChangeRole: false,
  },
  {
    action: ADMIN_ACTION.SET_SCHEMA,
    allowComment: false,
    allowChangeRole: false,
  },
];
