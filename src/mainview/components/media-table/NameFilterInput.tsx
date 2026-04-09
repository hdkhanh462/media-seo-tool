import type { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

type Props<TData> = {
  table: Table<TData>;
};

export function NameFilterInput<TData>({ table }: Props<TData>) {
  return (
    <Input
      placeholder="Filter by name..."
      value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("name")?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}
