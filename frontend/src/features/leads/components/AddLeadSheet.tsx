import { UserPlus } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLeadApi } from "../api";
import { toast } from "sonner";
import { useContext } from "react";
import AuthContext from "@/features/auth/context";
import { useParams } from "react-router";
import { LeadStatus } from "@/types/lead.model";
import type { CreateLeadRequestData } from "../types";
import { CreateLeadSchema } from "../schemas";

function AddLeadSheet() {
    const authContext = useContext(AuthContext);
    const params = useParams();
    const queryClient = useQueryClient();

    const createLeadMutation = useMutation({
        mutationFn: createLeadApi,
        onSuccess: () => {
            queryClient.invalidateQueries(['get-leads'] as any)
        },
        onError: (err) => {
            toast.error(err.message);        
        }
    });

    const formik = useFormik({
        initialValues: { status: LeadStatus.NEW, notes: '', title: '', expectedAmount: 0 },
        onSubmit: async (values) => {
            if (!params.organizationId || !authContext.auth.user) {
                throw Error("An error occured");
            }

            const data: CreateLeadRequestData = { 
                creatorId: authContext.auth.user.id,
                organizationId: params.organizationId,
                status: values.status,
                title: values.title,
                expectedAmount: values.expectedAmount,
                notes: values.notes
            }

            const mutationResponse = await createLeadMutation.mutate(data);
            queryClient.invalidateQueries(['get-leads'] as any)
            return mutationResponse;
        },
        validationSchema: CreateLeadSchema
    });

    return (
        <Sheet>
            <SheetTrigger>
                <UserPlus />
                Add Lead
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Add a new lead</SheetTitle>
                <SheetDescription>
                    Fill in the details below to add a new lead to your list. You can edit this information later.
                </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                        <Label>Title</Label>
                        <Input
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            name="title"
                        />
                        {formik.errors.title && <p>{formik.errors.title}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label>Expected Amount</Label>
                        <Input
                            prefix="$"
                            name="expectedAmount"
                            value={formik.values.expectedAmount}
                            onChange={formik.handleChange}
                            type="number" 
                        />
                        {formik.errors.expectedAmount && <p>{formik.errors.expectedAmount}</p>}
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
                        <Label>Status</Label>
                        <Select
                            name="status"
                            onValueChange={(status: LeadStatus) => {
                                formik.setValues({...formik.values, status: status})
                            }}
                            value={formik.values.status}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                                    <SelectItem value={LeadStatus.CONTACTED}>Contacted</SelectItem>
                                    <SelectItem value={LeadStatus.QUALIFIED}>Qualified</SelectItem>
                                </SelectContent>
                        </Select>
                        {formik.errors.status && <p>{formik.errors.status}</p>}
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit" onClick={() => {
                            formik.handleSubmit();
                        }}>Save changes</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default AddLeadSheet;
