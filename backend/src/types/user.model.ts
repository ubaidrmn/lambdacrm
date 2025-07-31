import { Organization, OrganizationRole } from "./organization.model";

/**
 * Represents a user in the CRM.
 *
 * Stored as a top-level entity. The partition key is the user's Cognito Subject ID (sub).
 * Each Cognito user has a one-to-one mapping with a User entity stored in the DynamoDB table.
 */
export interface User {
  id: string; // e.g., "USER_<SUB>"
  email: string;
  name: string;
  verified: boolean;
  picture?: string;

  // Note: These are not stored in the entity itself, but are populated after fetching for easier access.
  organizations?: UserOrganization[];
}

/**
 * Represents the relationship between a user and an organization.
 *
 * Enables querying all organizations a user is part of by using the user ID as
 * the partition key and the organization PK as the sort key.
 * This complements the OrganizationMember entity and avoids the need for a GSI.
 */
export interface UserOrganization {
  userId: string; // (PK) => e.g., "USER_<SUB>"
  organizationId: string; // (SK) => e.g., "ORGANIZATION_123"
  role: OrganizationRole;

  // Note: These are not stored in the entity itself, but are populated after fetching for easier access.
  member?: User;
  organization?: Organization;
}
