import DataTable from "@/components/shared/DataTable";
import AddLeadSheet from "./components/AddLeadSheet";
import LeadsPageBreadcrumb from "./components/LeadsPageBreadcrumb";
import { leadsDataTableColumns } from "./constants";

function LeadsPage() {
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
            <DataTable columns={leadsDataTableColumns} data={[
                { id: "1", contactId: "123", status: "NEW", title: "First Lead", expectedAmount: 0, notes: "" },
                { id: "2", contactId: "456", status: "CONTACTED", title: "First Lead", expectedAmount: 0, notes: "" },
                { id: "3", contactId: "789", status: "QUALIFIED", title: "First Lead", expectedAmount: 0, notes: "" }
            ]} />
      </>
    );
}

export default LeadsPage;
