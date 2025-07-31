/**
 * Represents an organization in the CRM.
 *
 * Stored as a top-level entity.
 */
export interface Organization {
  id: string; // e.g., organization_123
  title: string;
  creatorId: string; // e.g., USER_<SUB>
}

/*
 * Represents a user's membership in an organization.
 * 
 * To enable efficient querying of all members in a organization, each member is stored
 * with the organization ID as the partition key (PK) and the user ID as the sort key (SK).
 * 
 * Note (Ubaid): To support querying all organizations a user belongs to, we store a separate
 * record under a different entity (Userorganization). We could alternatively use a GSI,
 * but for simplicity's sake & considering at the time of development we are using AWS free tier,
 * this is the way to go.
 */
export interface OrganizationMember {
  organizationId: string; // (PK) => e.g., organization_123
  memberId: string; // (SK) =>  e.g., USER_<SUB>
  role: OrganizationRole; // e.g., ADMIN
}

/**
 * Represents a role a user can have within an organization.
 */
export const enum OrganizationRole {
  OWNER = "OWNER",
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}
