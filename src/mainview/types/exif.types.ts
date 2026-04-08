import * as z from "zod";
import { ExifFormSchema } from "@/schemas/exif.schema";

export type ExifFormValues = z.infer<typeof ExifFormSchema>;
