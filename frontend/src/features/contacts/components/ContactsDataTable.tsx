import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContactApi } from "../api";
import EditContactSheet from "./EditContactSheet";
import type { Lead } from "@/types/lead.model";

export function ContactsDataTable({
  data,
  columns,
  leads
}: { data: any; columns: any; leads: Lead[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const queryClient = useQueryClient();
  const deleteContactMutation = useMutation({
    mutationFn: deleteContactApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["get-contacts"] as any);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
            <TableHead key={"actions-header"}>Actions</TableHead>
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <EditContactSheet initialData={row.original as any} leads={leads} />
                  <Button
                    onClick={async () => {
                      const data = row.original as any;
                      deleteContactMutation.mutate({
                        id: data.id,
                        organizationId: data.organizationId,
                      });
                    }}
                    className="ml-2"
                    variant={"destructive"}
                  >
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ContactsDataTable;
