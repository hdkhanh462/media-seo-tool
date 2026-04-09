import { ExportSchema } from "@/schemas/export.schema";
import * as z from "zod";

export type ExportValues = z.infer<typeof ExportSchema>;
