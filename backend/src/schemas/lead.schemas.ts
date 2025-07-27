import { LeadStatus } from "@/types/lead.model";
import * as z from "zod";
 
export const CreateLeadRequestBody = z.object({
  title: z.string(),
  notes: z.string().nullable(),
  expectedAmount: z.number().nullable(),
  status: z.enum([LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED])
});

export type CreateLeadRequestBodyType = z.infer<typeof CreateLeadRequestBody>;
