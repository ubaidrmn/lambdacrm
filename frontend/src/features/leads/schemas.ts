import { LeadStatus } from "@/types/lead.model";
import * as Yup from "yup";

export const CreateLeadSchema = Yup.object().shape({
  title: Yup.string().required(`Lead's title is required!`),
  status: Yup.string<LeadStatus>().required(`Lead's status is required!`),
  expectedAmount: Yup.number(),
  notes: Yup.string(),
});
