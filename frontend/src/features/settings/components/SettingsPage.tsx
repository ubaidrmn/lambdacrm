import { useTheme } from "@/components/shared/ThemeProvider/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, TrashIcon } from "lucide-react";
import SettingsPageBreadCrumb from "./SettingsPageBreadCrumb";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationMembersApi } from "../api";
import { AddOrganizationMemberDialog } from "./AddOrganizationMemberDialog";

const SettingsPage = () => {
    const { setTheme } = useTheme()
    const params: any = useParams();
    const organizationMembers = useQuery({
      queryKey: ["get-organization-members"],
      queryFn: async () => await getOrganizationMembersApi(params.organizationId),
      initialData: [],
    });

    return (
        <>
          <SettingsPageBreadCrumb />
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-2">
            Organization Settings
          </h2>
          <p className="leading-7 mt-2">
            Manage your leads here. You can add, edit, and track your leads to
            convert them into contacts.
          </p>

          <Separator className="mt-4 mb-4" />

          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Theme
          </h3>
          <div className="flex gap-x-4 mt-2 mb-2">
            <p className="mt-1">              
              Select theme
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator className="mt-4 mb-4" />
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Members
          </h3>
          <p className="leading-7 mt-2 mb-2">
            Manage members in this organization.
          </p>
          <AddOrganizationMemberDialog />
          <Table>
            <TableCaption>List of all members in this organization.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizationMembers.data.map(om => {
                return <TableRow key={om.memberId}>
                  <TableCell className="font-medium">{om.member?.name}</TableCell>
                  <TableCell>{om.member?.email}</TableCell>
                  <TableCell>{om.role}</TableCell>
                  <TableCell>
                    <Button variant={"destructive"}><TrashIcon /></Button>
                  </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </>
    );
}

export default SettingsPage;
