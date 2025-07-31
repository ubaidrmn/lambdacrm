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
