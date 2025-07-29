import type { ColumnDef } from "@tanstack/react-table";
import type { Lead } from "./types";

export const leadsDataTableColumns = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "contactId",
        header: "Contact ID"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "expectedAmount",
        header: "Expected Amount"
    },
    {
        accessorKey: "notes",
        header: "Notes"
    },
    {
        accessorKey: "title",
        header: "Title"
    },
]
