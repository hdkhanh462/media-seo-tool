import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import type { ExtractOptions, ExtractResult } from "~/shared/types";

import { getExiftoolInstance } from "../lib/exiftool-vendored";
import { getExif } from "../utils";

export async function extractMetadata(
  options: ExtractOptions,
): Promise<ExtractResult> {
  const { imagesFolder, outputExcel } = options;

  console.log("Starting Media Metadata Extractor...");
  console.log(`Target Folder: ${path.resolve(imagesFolder)}`);
  console.log(`Output Excel: ${path.resolve(outputExcel)}`);

  if (!fs.existsSync(imagesFolder)) {
    console.error(`Folder not found: ${imagesFolder}`);
    return { success: false, message: "Folder not found" };
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("SEO Data");

  worksheet.columns = [
    { header: "FileName", key: "fileName", width: 30 },
    { header: "Title", key: "title", width: 40 },
    { header: "Subject", key: "subject", width: 30 },
    { header: "Rating", key: "rating", width: 10 },
    { header: "Tags", key: "tags", width: 40 },
    { header: "Comments", key: "comments", width: 50 },
  ];

  const files = fs.readdirSync(imagesFolder);
  const mediaExtensions = [".jpg", ".jpeg", ".png", ".mp4", ".mov", ".webp"];

  let processedCount = 0;
  const rows: Record<string, unknown>[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!mediaExtensions.includes(ext)) continue;

    const filePath = path.join(imagesFolder, file);

    console.log(`Reading metadata: ${file}`);

    // Create a fresh exiftool instance for each file to avoid BatchCluster issues
    const exiftool = getExiftoolInstance();

    try {
      const tags = await exiftool.read(filePath);
      const { title, subject, rating, tagArray, comments } = getExif(tags);

      rows.push({
        fileName: file,
        title,
        subject,
        rating,
        tags: tagArray,
        comments,
      });

      processedCount++;
    } catch (err: unknown) {
      console.warn(
        `Could not read metadata for ${file}: ${(err as Error).message}`,
      );

      rows.push({
        fileName: file,
        title: "",
        subject: "",
        rating: 0,
        tags: "",
        comments: "",
      });
    } finally {
      // Clean up the exiftool instance
      await exiftool.end();
    }
  }

  // Sort for stable output
  rows.sort((a, b) =>
    (a.fileName as string).localeCompare(b.fileName as string),
  );

  // Write to Excel (safe)
  for (const row of rows) {
    worksheet.addRow(row);
  }

  try {
    await workbook.xlsx.writeFile(outputExcel);
    console.log(
      `Successfully exported ${processedCount} files to ${outputExcel}`,
    );
    return { success: true, message: "Extraction completed", processedCount };
  } catch (error: unknown) {
    console.error(`Failed to save Excel file: ${(error as Error).message}`);
    return { success: false, message: "Failed to save Excel file" };
  }
}
