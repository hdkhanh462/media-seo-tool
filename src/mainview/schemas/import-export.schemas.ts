import * as z from "zod";

export const ExportSchema = z.object({
  fileName: z.string().nonempty("File name is required"),
  folderPath: z.string().nonempty("Folder path is required"),
  fullPath: z.string().nonempty("Full path is required"),
  overwrite: z.boolean().optional(),
});

export const ImportSchema = z.object({
  fullPath: z.string().nonempty("Full path is required"),
});
