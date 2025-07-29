/**
 * Represents a lead associated with a specific organization.
 *
 * Each lead is stored under its parent organization using a composite key.
 * - PK: the organization identifier (e.g., "organization_123")
 * - SK: the lead identifier (e.g., "LEAD_456")
 */
export interface Lead {
  PK: string; // e.g., "ORGANIZATION_123"
  SK: string; // e.g., "LEAD_123"
  creatorID: string; // e.g., "USER_SUBID"
  title: string;
  notes?: string;
  expectedAmount?: number;
  status: LeadStatus;
}

export interface CreateLeadRepositoryInput {
  data: { 
    title: string;
    notes?: string;
    expectedAmount?: number;
    status: LeadStatus;
  };
  userID: string;
  organizationID: string;
}

/**
 * Status values for a lead within an organization.
 */
export const enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED'
}
