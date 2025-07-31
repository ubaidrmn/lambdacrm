import type { Organization, OrganizationRole } from "./organization.model";

export interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  picture?: string;

  organizations?: UserOrganization[];
}

export interface UserOrganization {
  userId: string;
  organizationId: string;
  role: OrganizationRole;

  member?: User;
  organization?: Organization;
}
