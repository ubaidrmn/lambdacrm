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
import { useFormik } from "formik"
import { Building2Icon } from "lucide-react"
import { CreateOrganizationSchema } from "../schemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOrganizationApi } from "../api"
import { toast } from "sonner"

export function CreateOrganizationDialog() {
    const queryClient = useQueryClient();
    const createOrganizationMutation = useMutation({
        mutationFn: createOrganizationApi,
        onSuccess: () => {
            queryClient.invalidateQueries(["get-organizations"] as any);
            toast.success("Organization created successfuly!")
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
    const formik = useFormik({
        initialValues: {
            title: "Default Organization"
        },
        onSubmit: (values) => {
            createOrganizationMutation.mutate(values.title)
        },
        validationSchema: CreateOrganizationSchema
    });

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Create Organization <Building2Icon /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              You can add members to this organization in the settings once it has been created.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Title</Label>
              <Input name="title" value={formik.values.title} onChange={formik.handleChange} />
                {formik.errors.title && <p>{formik.errors.title}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={() => formik.handleSubmit()}>Create</Button>
            </DialogClose>
            
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
