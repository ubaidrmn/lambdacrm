import * as z from "zod";
 
export const CreateOrganizationRequestBody = z.object({
  title: z.string(),
});

export type CreateOrganizationRequestBodyType = z.infer<typeof CreateOrganizationRequestBody>;
