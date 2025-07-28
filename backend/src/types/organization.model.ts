/**
 * Represents an organization in the CRM.
 *
 * Stored as a top-level entity.
 */
export interface Organization {
  PK: string; // e.g., organization_123
  SK: string; // e.g., META
  title: string;
  creatorID: string; // e.g., USER_<SUB>
}

export interface CreateOrganizationRepositoryInput {
  title: string;
  creatorID: string;
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
  PK: string; // e.g., organization_123
  SK: string; // e.g., USER_<SUB>
  role: OrganizationRole; // e.g., ADMIN
}

/**
 * Represents a role a user can have within an organization.
 */
export const enum OrganizationRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}
