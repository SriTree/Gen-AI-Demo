"use client";

import React, { useState } from "react";
import { Prompt } from "../services/DataService";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  data: Prompt[];
}

const Table: React.FC<Props> = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState<{
    [key: string]: boolean;
  }>({});

  const truncateResponse = (response: string) => {
    const words = response.split(" ");
    return words.length > 60 ? `${words.slice(0, 60).join(" ")}...` : response;
  };

  const columns: ColumnDef<Prompt>[] = [
    { accessorKey: "category", header: "Category" },
    { accessorKey: "query", header: "Query" },
    { accessorKey: "successful_prompt", header: "Successful Prompt" },
    {
      accessorKey: "response",
      header: "Response",
      cell: ({ row }) => (
        <div>
          <span>{truncateResponse(row.original.response)}</span>
        </div>
      ),
    },
    { accessorKey: "feedback", header: "Feedback" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <div className="relative bg-gray-900 p-4 w-full rounded-lg shadow-md">
      <div className="w-full scale-100">
        <ShadTable className="w-full text-base text-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-4 px-6 border-b border-gray-700 bg-gray-800 text-left text-base leading-6 text-gray-300 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const isExpanded = expandedRows[row.id];
              return (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(row.id)}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={`py-4 px-6 border-b border-gray-700 text-white ${
                          isExpanded ? "whitespace-normal" : "truncate max-w-xs"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </ShadTable>
      </div>
    </div>
  );
};

export default Table;
