import { EditIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContactApi } from "../api";
import { toast } from "sonner";
import { useContext } from "react";
import AuthContext from "@/features/auth/context";
import { useParams } from "react-router";
import type { UpdateContactRequestData } from "../types";
import { MutateContactSchema } from "../schemas";
import type { Lead } from "@/types/lead.model";

function EditContactSheet(props: {
  leads: Lead[];
  initialData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    notes: string;
    associatedLeadId: string;
    id: string;
  };
}) {
  const authContext = useContext(AuthContext);
  const params: any = useParams();
  const queryClient = useQueryClient();

  const updateContactMutation = useMutation({
    mutationFn: updateContactApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["get-contacts"] as any);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      fullName: props.initialData.fullName,
      email: props.initialData.email,
      phoneNumber: props.initialData.phoneNumber,
      notes: props.initialData.notes,
      associatedLeadId: props.initialData.associatedLeadId,
    },
    onSubmit: async (values) => {
      if (!params.organizationId || !authContext.auth.user) {
        throw Error("An error occured");
      }

      const data: UpdateContactRequestData = {
        id: props.initialData.id,
        organizationId: params.organizationId,
        fullName: values.fullName,
        email: values.email || undefined,
        notes: values.notes || undefined,
        phoneNumber: values.phoneNumber || undefined,
        associatedLeadId: values.associatedLeadId || undefined,
      };

      const mutationResponse = await updateContactMutation.mutate(data);
      queryClient.invalidateQueries(["get-contacts"] as any);
      return mutationResponse;
    },
    validationSchema: MutateContactSchema,
  });

  return (
    <Sheet onOpenChange={(open) => open && formik.resetForm()}>
      <SheetTrigger>
        <EditIcon />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a new contact</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new contact to your list. You can
            edit this information later.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label>Full Name</Label>
            <Input
              value={formik.values.fullName}
              onChange={formik.handleChange}
              name="fullName"
            />
            {formik.errors.fullName && <p>{formik.errors.fullName}</p>}
          </div>
          <div className="grid gap-3">
            <Label>Email</Label>
            <Input
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
            />
            {formik.errors.email && <p>{formik.errors.email}</p>}
          </div>
          <div className="grid gap-3">
            <Label>Phone</Label>
            <Input
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              name="phoneNumber"
            />
            {formik.errors.phoneNumber && <p>{formik.errors.phoneNumber}</p>}
          </div>
          <div className="grid gap-3">
            <Label>Notes</Label>
            <Textarea
              value={formik.values.notes}
              onChange={formik.handleChange}
              name="notes"
            />
            {formik.errors.notes && <p>{formik.errors.notes}</p>}
          </div>
          <div className="grid gap-3">
            <Label>Linked Lead</Label>
            <Select
              name="associatedLeadId"
              onValueChange={(leadId: string) => {
                formik.setValues({
                  ...formik.values,
                  associatedLeadId: leadId,
                });
              }}
              value={formik.values.associatedLeadId}
            >
              <SelectTrigger defaultValue={""} className="w-[180px]">
                <SelectValue placeholder="Not Selected" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"NOT_SELECTED"}>Not Selected</SelectItem>
                {props.leads.map((lead: Lead) => {
                  return <SelectItem key={lead.id} value={lead.id}>{lead.title}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            {formik.errors.associatedLeadId && (
              <p>{formik.errors.associatedLeadId}</p>
            )}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              Save changes
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default EditContactSheet;
