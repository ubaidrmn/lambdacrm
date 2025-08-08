import { z } from "zod";

// Create Contact Schema
export const CreateContactRequestBody = z.object({
  organizationId: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(4).optional(),
  email: z.email().optional(),
  notes: z.string().optional(),
  associatedLeadId: z.string().optional(),
});

export type CreateContactRequestBodyType = z.infer<typeof CreateContactRequestBody>;

// Update Contact Schema
export const UpdateContactRequestBody = z.object({
  fullName: z.string().min(1).optional(),
  phoneNumber: z.string().min(4).optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  associatedLeadId: z.string().optional(),
});

export type UpdateContactRequestBodyType = z.infer<typeof UpdateContactRequestBody>;
