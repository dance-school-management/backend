"use client";

import {
  IconChevronDown,
  IconChevronRight,
  IconLayoutColumns,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import z from "zod";

import { NewEmployeeDrawer, UpdateEmployeeDrawer } from "@/components/employee-drawers";
import { EmployeeRole } from "@/lib/model/employee";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  role: z.string(),
  photoUrl: z.string().url().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
});

export const employees: z.infer<typeof schema>[] = [
  { id: 1, name: "John", surname: "Smith", email: "john@smith.com", role: EmployeeRole.Admin, phone: "123-456-7890", photoUrl: "https://avatar.iran.liara.run/public/28" },
  { id: 2, name: "Kate", surname: "Doe", email: "test@test.pl", role: EmployeeRole.Trainer, phone: "123-456-7890", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." },
  { id: 3, name: "Alice", surname: "Smith", email: "alice@gmail.com", role: EmployeeRole.Receptionist, phone: "123-456-7890", photoUrl: "https://avatar.iran.liara.run/public/93" },
];

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "photoUrl",
    header: "",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.photoUrl} alt="User Photo" />
          <AvatarFallback>{`${row.original.name[0]}${row.original.surname[0]}`}</AvatarFallback>
        </Avatar>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <UpdateEmployeeDrawer employee={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: () => <div className="w-full text-center">Role</div>,
    cell: ({ row }) => (
      <div className="flex flex-1">
        <Badge variant="secondary" className="mx-auto text-muted-foreground px-1.5">
          {row.original.role}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="w-full">Email</div>,
  },
  {
    accessorKey: "phone",
    header: () => <div className="w-full">Phone</div>,
  },
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.getCanExpand() && (
          <Button
            variant="outline"
            className="size-8 cursor-pointer"
            size="icon"
            onClick={row.getToggleExpandedHandler()}
          >
            {row.getIsExpanded() ? <IconChevronDown /> : <IconChevronRight />}
          </Button>
        )}
      </div>
    ),
    enableHiding: false,
  },
];

function ExpandableRow({ row }: { row: Row<z.infer<typeof schema>>; }) {
  return (
    <>
      <TableRow className="relative z-0">
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
      {row.getCanExpand() && row.getIsExpanded() && (
        <TableRow>
          <td className="px-4 py-1" colSpan={row.getVisibleCells().length}>
            <h2 className="text-lg font-semibold p-0">
              Profile description:
            </h2>
            <div className="">
              {row.original.description}
            </div>
          </td>
        </TableRow>
      )}
    </>
  );
}

export function DataTable({ data }: { data: z.infer<typeof schema>[]; }) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: columns,
    getRowCanExpand: ({ original }) => !!original.description && original.description.length > 0,
    state: {
      columnVisibility,
      columnFilters,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
        <NewEmployeeDrawer />
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <ExpandableRow key={row.id} row={row} />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
