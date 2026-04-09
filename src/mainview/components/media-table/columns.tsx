"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StarIcon } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { BadgeOverflow } from "@/components/ui/badge-overflow";
import { Rating, RatingItem } from "@/components/ui/rating";
import { bytesToSize } from "@/utils/formatter";
import type { MediaWithExif } from "~/shared/types";

export const columns: ColumnDef<MediaWithExif>[] = [
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
    header: "Type",
    cell: ({ row }) => {
      const type = (row.getValue("type") as string).split("/")[1].toUpperCase();
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
      <div className="max-w-50 truncate">{row.original.exif?.title || "-"}</div>
    ),
  },
  {
    accessorKey: "exif.subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="max-w-50 truncate">
        {row.original.exif?.subject || "-"}
      </div>
    ),
  },
  {
    accessorKey: "exif.keywords",
    header: "Keywords",
    cell: ({ row }) => {
      const keywords = row.original.exif?.keywords || [];
      return (
        <div className="flex max-w-50 flex-wrap gap-1">
          {keywords.length > 0 ? (
            <BadgeOverflow
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
    header: "Rating",
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
    cell: ({ row }) => <div>{row.original.exif?.author || "-"}</div>,
  },
  {
    accessorKey: "exif.license",
    header: "License",
    cell: ({ row }) => <div>{row.original.exif?.license || "-"}</div>,
  },
];
