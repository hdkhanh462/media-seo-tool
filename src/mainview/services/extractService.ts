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

export interface LogEntry {
  type: "info" | "success" | "warn" | "error";
  message: string;
}

export async function extractMetadata(
  options: ExtractOptions,
  onLog: (log: LogEntry) => void,
): Promise<ExtractResult> {
  const { imagesFolder, outputExcel, concurrent } = options;

  onLog({ type: "info", message: "Starting Media Metadata Extractor..." });
  onLog({
    type: "info",
    message: `Target Folder: ${path.resolve(imagesFolder)}`,
  });
  onLog({
    type: "info",
    message: `Output Excel: ${path.resolve(outputExcel)}`,
  });
  onLog({ type: "info", message: `Concurrent Tasks: ${concurrent}` });

  if (!fs.existsSync(imagesFolder)) {
    onLog({ type: "error", message: `Folder not found: ${imagesFolder}` });
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

  const limit = pLimit(concurrent);
  const tasks: Promise<void>[] = [];
  const rows: {
    fileName: string;
    title: string;
    subject: string;
    rating: number;
    tags: string;
    comments: string;
  }[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!mediaExtensions.includes(ext)) continue;

    const filePath = path.join(imagesFolder, file);

    const task = limit(async () => {
      onLog({ type: "info", message: `Reading metadata: ${file}` });

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
        onLog({
          type: "warn",
          message: `Could not read metadata for ${file}: ${(err as Error).message}`,
        });

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
  rows.sort((a, b) => a.fileName.localeCompare(b.fileName));

  // Write to Excel (safe)
  for (const row of rows) {
    worksheet.addRow(row);
  }

  try {
    await workbook.xlsx.writeFile(outputExcel);
    onLog({
      type: "success",
      message: `Successfully exported ${processedCount} files to ${outputExcel}`,
    });
    return { success: true, message: "Extraction completed", processedCount };
  } catch (error: unknown) {
    onLog({
      type: "error",
      message: `Failed to save Excel file: ${(error as Error).message}`,
    });
    return { success: false, message: "Failed to save Excel file" };
  } finally {
    await exiftool.end();
  }
}
