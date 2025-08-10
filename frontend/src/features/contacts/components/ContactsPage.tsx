import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getContactsApi } from "../api";
import ContactsPageBreadCrumb from "./ContactsPageBreadCrumb";
import AddContactSheet from "./AddContactSheet";
import { ContactsDataTable } from "./ContactsDataTable";
import { getLeadsApi } from "@/features/leads/api";
import moment from "moment";

export const contactsDataTableColumns = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
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
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }: { row: any }) => {
      const value = row.getValue("createdAt") as string;
      const date = new Date(value);
      return <div className="font-medium">{moment(date).format('MMMM Do YYYY')}</div>;
    },
  },
];

function ContactsPage() {
  const params: any = useParams();
  const contactsQuery = useQuery({
    queryKey: ["get-contacts"],
    queryFn: async () => await getContactsApi(params.organizationId),
    initialData: [],
  });
  const leadsQuery = useQuery({
    queryKey: ["get-leads"],
    queryFn: async () => await getLeadsApi(params.organizationId),
    initialData: [],
  });

  return (
    <>
      <ContactsPageBreadCrumb />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-2">
        Contacts
      </h2>
      <p className="leading-7 mt-2 mb-2">
        Manage your contacts here. You can add, edit, and delete your contacts.
      </p>
      <AddContactSheet leads={leadsQuery.data} />
      <div className="mt-4"></div>
      <ContactsDataTable
        columns={contactsDataTableColumns}
        data={contactsQuery.data}
        leads={leadsQuery.data}
      />
    </>
  );
}

export default ContactsPage;
