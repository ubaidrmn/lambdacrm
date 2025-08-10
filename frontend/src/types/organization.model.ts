import type { User } from "./user.model";

export interface Organization {
  id: string;
  title: string;
  creatorId: string;
}

export const enum OrganizationRole {
  OWNER = "OWNER",
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface OrganizationMember {
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
  member?: User;
}
