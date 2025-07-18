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
              { id: "1", contact_id: "123", status: "New" },
              { id: "2", contact_id: "456", status: "Contacted" },
              { id: "3", contact_id: "789", status: "Converted" }
          ]} />
      </>
    );
}

export default LeadsPage;
