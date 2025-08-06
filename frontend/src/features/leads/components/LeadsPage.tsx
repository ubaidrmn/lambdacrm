import LeadsDataTable from "@/features/leads/components/LeadsDataTable";
import AddLeadSheet from "./AddLeadSheet";
import LeadsPageBreadcrumb from "./LeadsPageBreadcrumb";
import { leadsDataTableColumns } from "../constants";
import { getLeadsApi } from "../api";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Lead } from "@/types/lead.model";
import EditLeadSheet from "./EditLeadSheet";

function LeadsPage() {
    const params: any = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['get-leads'],
        queryFn: async () => await getLeadsApi(params.organizationId),
        initialData: [],
    });

    return (
        <>
            <LeadsPageBreadcrumb />
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-2">
                Leads
            </h2>
            <p className="leading-7 mt-2 mb-2">
                Manage your leads here. You can add, edit, and track your leads to convert them into contacts.
            </p>
            <AddLeadSheet />
            <div className="mt-4"></div>
            <LeadsDataTable columns={leadsDataTableColumns} data={data.map((lead: Lead) => {
                return {
                    title: lead.title,
                    status: lead.status,
                    expectedAmount: lead.expectedAmount,
                    notes: lead.notes,
                }
            })} />
      </>
    );
}

export default LeadsPage;
