import type * as z from "zod";
import type { ExifFormSchema } from "@/schemas/exif.schema";

export type ExifFormValues = z.infer<typeof ExifFormSchema>;
