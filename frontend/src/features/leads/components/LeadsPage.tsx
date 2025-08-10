import LeadsDataTable from "@/features/leads/components/LeadsDataTable";
import AddLeadSheet from "./AddLeadSheet";
import LeadsPageBreadCrumb from "./LeadsPageBreadCrumb";
import { getLeadsApi } from "@/features/leads/api";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Lead } from "@/types/lead.model";

export const leadsDataTableColumns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "expectedAmount",
    header: "Expected Amount",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }: { row: any }) => {
      let value = row.getValue("notes") as string;
      if (value && value.length > 50) {
        value = value.slice(0, 47) + "...";
      }
      return <div className="font-medium">{value}</div>;
    },
  },
];

function LeadsPage() {
  const params: any = useParams();
  const { data } = useQuery({
    queryKey: ["get-leads"],
    queryFn: async () => await getLeadsApi(params.organizationId),
    initialData: [],
  });

  return (
    <>
      <LeadsPageBreadCrumb />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-2">
        Leads
      </h2>
      <p className="leading-7 mt-2 mb-2">
        Manage your leads here. You can add, edit, and track your leads to
        convert them into contacts.
      </p>
      <AddLeadSheet />
      <div className="mt-4"></div>
      <LeadsDataTable
        columns={leadsDataTableColumns}
        data={data.map((lead: Lead) => {
          return {
            title: lead.title,
            status: lead.status,
            expectedAmount: lead.expectedAmount,
            notes: lead.notes,
            id: lead.id,
            organizationId: lead.organizationId,
          };
        })}
      />
    </>
  );
}

export default LeadsPage;
