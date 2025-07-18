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

function AddLeadSheet() {
    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="secondary" size={"sm"}>
                    <UserPlus />
                    Add Lead
                </Button>
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
                        <Label htmlFor="add-lead-sheet-name">Name</Label>
                        <Input id="add-lead-sheet-name" defaultValue="Ubaid" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="add-lead-sheet-email">Email</Label>
                        <Input id="add-lead-sheet-email" defaultValue="rehmanubaid2003@gmail.com" />
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
