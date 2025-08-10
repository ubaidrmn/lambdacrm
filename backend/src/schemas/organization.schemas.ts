import { OrganizationRole } from "@/types/organization.model";
import * as z from "zod";

export const CreateOrganizationRequestBody = z.object({
  title: z.string(),
});

export type CreateOrganizationRequestBodyType = z.infer<
  typeof CreateOrganizationRequestBody
>;

export const AddOrganizationMemberRequestBody = z.object({
  email: z.email(),
  role: z.enum([
    OrganizationRole.ADMIN,
    OrganizationRole.EMPLOYEE,
    OrganizationRole.OWNER,
  ]),
});

export type AddOrganizationMemberRequestBodyType = z.infer<
  typeof AddOrganizationMemberRequestBody
>;
