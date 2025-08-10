import type { OrganizationRole } from "@/types/organization.model";
import * as Yup from "yup";

export const AddOrganizationMemberSchema = Yup.object().shape({
  email: Yup.string().email().required(`Email is required!`),
  role: Yup.string<OrganizationRole>().required(`Role is required!`),
});
