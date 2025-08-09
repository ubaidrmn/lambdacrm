import * as Yup from "yup";

export const CreateOrganizationSchema = Yup.object().shape({
    title: Yup.string().required()
});
