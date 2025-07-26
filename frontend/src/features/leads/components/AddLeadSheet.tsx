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

function AddLeadSheet() {

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
                        <Input />
                    </div>
                    <div className="grid gap-3">
                        <Label>Expected Amount</Label>
                        <Input prefix="$" type="number" />
                    </div>
                    <div className="grid gap-3">
                        <Label>Notes</Label>
                        <Textarea />
                    </div>
                    <div className="grid gap-3">
                        <Label>Status</Label>
                        <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="QUALIFIED">Qualified</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit">Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default AddLeadSheet;
