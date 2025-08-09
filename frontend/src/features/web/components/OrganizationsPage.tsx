import WebNavbar from "@/components/shared/WebNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import { useQuery } from "@tanstack/react-query";
import { getUserOrganizationsApi } from "../api";
import type { UserOrganization } from "@/types/user.model";

export default function OrganizationsPage() {
  const organizations = useQuery({
    queryKey: ["get-organizations"],
    queryFn: getUserOrganizationsApi,
    initialData: []
  })

  return (
    <>
      <WebNavbar />
      <section className="max-w-7xl m-auto mt-[100px] px-4 md:px-8">
        <div className="flex justify-between">
            <h2 className="text-3xl font-semibold tracking-tight m-0">
                Organizations
            </h2>
            <CreateOrganizationDialog />
        </div>
        <p className="leading-7 mt-2 mb-5">
          You can manage all of your organizations here.
        </p>
        
        {organizations.data.length > 0 ? 
        <>
        <div className="grid grid-cols-3 gap-x-5 gap-y-5"> {organizations.data.map((userOrg: UserOrganization) => {
          return (
            <Card key={userOrg.organizationId}>
              <CardHeader>
                <CardTitle>{userOrg.organization?.title}</CardTitle>
                <CardDescription>
                  {userOrg.role.substring(0, 1).toUpperCase() +
                    userOrg.role.substring(1).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/app/organizations/${userOrg.organizationId}/dashboard`}
                >
                  <Button>Open</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })} </div> 
        </>
        : <p className="leading-7 mt-2 mb-5 italic text-destructive">No organizations were found linked to your account. Create a new organization or ask your team to add you to an organization.</p>}
      
      </section>
    </>
  );
}
