import { Organization } from "./organization.model";
import { User } from "./user.model";

/**
 * Represents a lead associated with a specific organization.
 *
 * Each lead is stored under its parent organization using a composite key.
 * - PK: the organization identifier (e.g., "organization_123")
 * - SK: the lead identifier (e.g., "LEAD_456")
 */
export interface Lead {
  id: string; // (PK)
  organizationId: string; // (SK) => e.g., "ORGANIZATION_123"
  creatorId: string; // e.g., "USER_SUBID"
  title: string;
  notes?: string;
  expectedAmount?: number;
  status: LeadStatus;

  // Note: These are not stored in the entity itself, but are populated after fetching for easier access.
  creator?: User;
  organization?: Organization;
}

/**
 * Status values for a lead within an organization.
 */
export const enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED'
}
