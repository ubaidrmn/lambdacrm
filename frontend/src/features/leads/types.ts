import type { LeadStatus } from "@/types/lead.model";

export interface CreateLeadRequestData {
  organizationId: string;
  creatorId: string;
  title: string;
  notes?: string;
  expectedAmount?: number;
  status: LeadStatus;
}

export interface UpdateLeadRequestData {
  organizationId: string;
  creatorId: string;
  title: string;
  notes?: string;
  expectedAmount?: number;
  status: LeadStatus;
}
