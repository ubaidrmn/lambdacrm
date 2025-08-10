import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrganizationRole } from "@/types/organization.model"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { addOrganizationMemberApi } from "../api"
import { toast } from "sonner"
import { useFormik } from "formik"
import { useParams } from "react-router"
import { AddOrganizationMemberSchema } from "../schemas"

export function AddOrganizationMemberDialog() {
  const queryClient = useQueryClient();
  const params: any = useParams();

  const addOrganizationMemberMutation = useMutation({
    mutationFn: addOrganizationMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["get-organization-members"] as any);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      role: OrganizationRole.EMPLOYEE,
    },
    onSubmit: (values) => {
        console.log("SUBMITING")
      if (!params.organizationId) {
        throw Error("An error occured");
      }
      addOrganizationMemberMutation.mutate({
        email: values.email,
        role: values.role,
        organizationId: params.organizationId
      });
    },
    validationSchema: AddOrganizationMemberSchema,
  });


  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="mb-2" variant={"secondary"}>Add Member<PlusIcon /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Fill the form to add a new member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Email</Label>
              <Input name="email" value={formik.values.email} onChange={formik.handleChange} />
            {formik.errors.email && <p>{formik.errors.email}</p>}
            </div>
            <div className="grid gap-3">
                <Select
                    name="role"
                    onValueChange={(role: OrganizationRole) => {
                        formik.setValues({ ...formik.values, role: role });
                    }}
                    value={formik.values.role}
                >
                <SelectTrigger className="w-[180px]">
                    <SelectValue defaultValue={OrganizationRole.EMPLOYEE} placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={OrganizationRole.EMPLOYEE}>Employee</SelectItem>
                    <SelectItem value={OrganizationRole.ADMIN}>Admin</SelectItem>
                </SelectContent>
                </Select>
                {formik.errors.role && <p>{formik.errors.role}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button onClick={() => {
                    formik.handleSubmit();
                }}>Add</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
