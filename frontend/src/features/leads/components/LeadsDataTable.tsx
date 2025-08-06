import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditLeadSheet from "./EditLeadSheet"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { deleteLeadApi } from "../api"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function LeadsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const queryClient = useQueryClient();
  const deleteLeadMutation = useMutation({
    mutationFn: deleteLeadApi,
    onSuccess: () => {
      queryClient.invalidateQueries(['get-leads'] as any)
    },
    onError: (error) => {
      toast.error(error.message);
    }
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
              )
            })}
              <TableHead key={"actions-header"}>
                Actions
              </TableHead>
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
                  <EditLeadSheet initialData={row.original as any} />
                  <Button onClick={async () => {
                    const data = row.original as any;
                    deleteLeadMutation.mutate({
                      id: data.id, 
                      organizationId: data.organizationId
                    });
                  }} className="ml-2" variant={"destructive"}><TrashIcon /></Button>
                </TableCell>
              </TableRow>
            )
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
  )
}

export default LeadsDataTable;
