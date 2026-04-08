import * as z from "zod";
import { exifFormSchema } from "@/schemas/exif.schema";

export type ExifFormValues = z.infer<typeof exifFormSchema>;
