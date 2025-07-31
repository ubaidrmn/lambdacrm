import WebNavbar from "@/components/shared/WebNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

export default function AppPage() {
    const organizations = [{
        title: "Ubaid LLC",
        role: "Owner",
        id: "ORGANIZATION_8844399b-01a5-4ee1-8e64-fd2df149382f"
    }, {
        title: "ABC Company",
        role: "Employee",
        id: "ORGANIZATION_8844399b-01a5-4ee1-8e64-fd2df149382f"
    }]
    
    return <>
        <WebNavbar />
        <section className="max-w-6xl m-auto mt-5">
        <h2 className="scroll-m-20 mb-5 text-3xl font-semibold tracking-tight first:mt-0">
            Organizations
        </h2>
        <div className="grid grid-cols-3 gap-x-5">
            {organizations.map(org => {
                return <>
                    <Card>
                        <CardHeader>
                            <CardTitle>{org.title}</CardTitle>
                            <CardDescription>{org.role}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to={`/app/organizations/${org.id}/dashboard`}>
                                <Button>Open</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </>
            })}
        </div>
        </section>
    </>
}
