"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StarIcon } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { BadgeOverflow } from "@/components/ui/badge-overflow";
import { Rating, RatingItem } from "@/components/ui/rating";
import { bytesToSize } from "@/utils/formatter";
import type { MediaWithExif } from "~/shared/types";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<MediaWithExif>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = (row.getValue("type") as string)
        .split("/")[1]
        ?.toUpperCase();
      return <Badge>{type}</Badge>;
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" align="end" />
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {bytesToSize(row.getValue("size") as number).label}
      </div>
    ),
  },
  {
    accessorKey: "exif.title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-30 truncate">{row.original.exif?.title || "-"}</div>
    ),
  },
  {
    accessorKey: "exif.subject",
    header: "Subject",
    cell: ({ row }) => {
      const subjects = row.original.exif?.subjects || [];
      return (
        <div className="flex min-w-30 max-w-50 flex-wrap gap-1">
          {subjects.length > 0 ? (
            <BadgeOverflow
              className="w-full"
              items={subjects}
              renderBadge={(_, label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              )}
            />
          ) : (
            <span>-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "exif.keywords",
    header: "Keywords",
    cell: ({ row }) => {
      const keywords = row.original.exif?.keywords || [];
      return (
        <div className="flex min-w-30 max-w-50 flex-wrap gap-1">
          {keywords.length > 0 ? (
            <BadgeOverflow
              className="w-full"
              items={keywords}
              renderBadge={(_, label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              )}
            />
          ) : (
            <span>-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "exif.rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.original.exif?.rating || 0;
      return (
        <Rating className="h-9 gap-1 text-yellow-500" value={rating} readOnly>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <StarIcon />
            </RatingItem>
          ))}
        </Rating>
      );
    },
  },
  {
    accessorKey: "exif.author",
    header: "Author",
    cell: ({ row }) => (
      <div className="max-w-20 truncate">
        {row.original.exif?.author || "-"}
      </div>
    ),
  },
];
