"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { columns } from "./columns";
import { mockMediaList } from "./mock-data";
import { useAppStore } from "@/store/useAppStore";

export function MediaTableDemo() {
  const setSelectedMedia = useAppStore((state) => state.setSelectedMedia);

  return (
    <>
      <h2 className="font-semibold mb-4 tracking-tight">
        Media with Exif Information
      </h2>
      <DataTable
        columns={columns}
        data={mockMediaList}
        onRowClick={(row) => setSelectedMedia(row)}
      >
        {(table) => (
          <div className="flex items-center justify-between">
            <Input
              placeholder="Filter by name..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            {/* <DataTableViewOptions table={table} /> */}
          </div>
        )}
      </DataTable>
    </>
  );
}
