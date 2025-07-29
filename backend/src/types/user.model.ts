import { OrganizationRole } from "./organization.model";

/**
 * Represents a user in the CRM.
 *
 * Stored as a top-level entity. The partition key is the user's Cognito Subject ID (sub).
 * Each Cognito user has a one-to-one mapping with a User entity stored in the DynamoDB table.
 */
export interface User {
  PK: string; // e.g., "USER_<SUB>"
  SK: string; // e.g., "META"
}

/**
 * Represents the relationship between a user and an organization.
 *
 * Enables querying all organizations a user is part of by using the user ID as
 * the partition key and the organization PK as the sort key.
 * This complements the OrganizationMember entity and avoids the need for a GSI.
 */
export interface UserOrganization {
  PK: string; // e.g., "USER_<SUB>"
  SK: string; // e.g., "ORGANIZATION_123"
  role: OrganizationRole;
}
