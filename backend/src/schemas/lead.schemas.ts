import { LeadStatus } from "@/types/lead.model";
import * as z from "zod";
 
export const CreateLeadRequestBody = z.object({
  organizationID: z.string(),
  title: z.string(),
  notes: z.string().nullable(),
  expectedAmount: z.number().nullable(),
  status: z.enum([LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED])
});

export type CreateLeadRequestBodyType = z.infer<typeof CreateLeadRequestBody>;

export const UpdateLeadRequestBody = z.object({
  title: z.string().optional(),
  notes: z.string().nullable().optional(),
  expectedAmount: z.number().nullable().optional(),
  status: z.enum([LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED]).optional()
});

export type UpdateLeadRequestBodyType = z.infer<typeof UpdateLeadRequestBody>;
