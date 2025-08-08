import * as Yup from "yup";

export const MutateContactSchema = Yup.object().shape({
  fullName: Yup.string().required(),
  phoneNumber: Yup.string().optional(),
  email: Yup.string().email().optional(),
  notes: Yup.string().optional(),
  associatedLeadId: Yup.string().optional()
});
