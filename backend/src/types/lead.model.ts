/**
 * Represents a lead associated with a specific project.
 *
 * Each lead is stored under its parent project using a composite key.
 * - PK: the project identifier (e.g., "PROJECT#123")
 * - SK: the lead identifier (e.g., "LEAD#456")
 */
export interface Lead {
  PK: string; // e.g., "PROJECT#123"
  SK: string; // e.g., "LEAD#123"
  creatorID: string; // e.g., "USER#SUBID"
  title: string;
  notes: string | null;
  expectedAmount: number | null;
  status: LeadStatus;
}

/**
 * Status values for a lead within a project.
 */
export const enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED'
}
