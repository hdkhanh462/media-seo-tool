import type * as z from "zod";
import type {
  ExportSchema,
  ImportSchema,
} from "@/schemas/import-export.schemas";

export type ExportValues = z.infer<typeof ExportSchema>;
export type ImportValues = z.infer<typeof ImportSchema>;
