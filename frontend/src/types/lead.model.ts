import type { Organization } from "./organization.model";
import type { User } from "./user.model";

export interface Lead {
  id: string;
  organizationId: string;
  creatorId: string;
  title: string;
  notes?: string;
  expectedAmount?: number;
  status: LeadStatus;

  creator?: User;
  organization?: Organization;
}

export const enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED'
}
