import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { exiftool } from "exiftool-vendored";
import pLimit from "p-limit";

import { getExif } from "../../old-cli/utils";

export interface ExtractOptions {
  imagesFolder: string;
  outputExcel: string;
  concurrent: number;
}

export interface ExtractResult {
  success: boolean;
  message: string;
  processedCount?: number;
}

export async function extractMetadata(
  options: ExtractOptions,
): Promise<ExtractResult> {
  const { imagesFolder, outputExcel, concurrent } = options;

  console.log("Starting Media Metadata Extractor...");
  console.log(`Target Folder: ${path.resolve(imagesFolder)}`);
  console.log(`Output Excel: ${path.resolve(outputExcel)}`);
  console.log(`Concurrent Tasks: ${concurrent}`);

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

  // Use sequential processing instead of concurrent to avoid exiftool BatchCluster crashes
  // Windows exiftool-vendored doesn't handle high concurrency well
  const safeLimit = Math.min(2, concurrent); // Max 2 concurrent to prevent exiftool crashes
  const limit = pLimit(safeLimit);
  const tasks: Promise<void>[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!mediaExtensions.includes(ext)) continue;

    const filePath = path.join(imagesFolder, file);

    const task = limit(async () => {
      console.log(`Reading metadata: ${file}`);

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
      }
    });

    tasks.push(task);
  }

  // Run all tasks with concurrency limit
  await Promise.all(tasks);

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
  } finally {
    await exiftool.end();
  }
}
