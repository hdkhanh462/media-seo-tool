import type * as z from "zod";
import type { ExifSchema } from "@/schemas/exif.schemas";

export type ExifValues = z.infer<typeof ExifSchema>;
