import type { ColumnDef } from "@tanstack/react-table";
import type { Lead } from "../types";

export const leadsDataTableColumns: ColumnDef<Lead>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "contact_id",
        header: "Contact ID"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
]
