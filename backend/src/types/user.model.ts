import { ProjectRole } from "./project.model";

/**
 * Represents a user in the CRM.
 *
 * Stored as a top-level entity. The partition key is the user's Cognito Subject ID (sub).
 * Each Cognito user has a one-to-one mapping with a User entity stored in the DynamoDB table.
 */
export interface User {
  PK: string; // e.g., "USER#<SUB>"
  SK: string; // e.g., "META"
}

/**
 * Represents the relationship between a user and a project.
 *
 * Enables querying all projects a user is part of by using the user ID as
 * the partition key and the project ID as the sort key.
 * This complements the ProjectMember record and avoids the need for a GSI.
 */
export interface UserProject {
  PK: string; // e.g., "USER#<SUB>"
  SK: string; // e.g., "PROJECT#123"
  role: ProjectRole;
}
