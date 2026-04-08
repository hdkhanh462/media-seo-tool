import * as z from "zod";

export const exifFormSchema = z.object({
  title: z
    .string()
    .max(100, "Title must be at most 100 characters.")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters.")
    .optional(),
  keywords: z.array(z.string()).optional(),
  rating: z
    .number()
    .min(0, "Rating must be at least 0.")
    .max(5, "Rating must be at most 5.")
    .optional(),
  author: z
    .string()
    .max(100, "Author must be at most 100 characters.")
    .optional(),
  license: z
    .string()
    .max(100, "License must be at most 100 characters.")
    .optional(),
});
