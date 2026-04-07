import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { exiftool } from "exiftool-vendored";
import pLimit from "p-limit";

import { getRowData } from "../../old-cli/utils";

export interface InjectOptions {
  imagesFolder: string;
  excelFile: string;
  concurrent: number;
}

export interface InjectResult {
  success: boolean;
  message: string;
  successCount?: number;
  failCount?: number;
}

export interface LogEntry {
  type: "info" | "success" | "warn" | "error";
  message: string;
}

export async function injectMetadata(
  options: InjectOptions,
  onLog: (log: LogEntry) => void,
): Promise<InjectResult> {
  const { imagesFolder, excelFile, concurrent } = options;

  onLog({ type: "info", message: "Starting SEO Media Injector..." });
  onLog({
    type: "info",
    message: `Target Folder: ${path.resolve(imagesFolder)}`,
  });
  onLog({ type: "info", message: `Source Excel: ${path.resolve(excelFile)}` });
  onLog({ type: "info", message: `Concurrent Tasks: ${concurrent}` });

  if (!fs.existsSync(imagesFolder)) {
    onLog({ type: "error", message: `Folder not found: ${imagesFolder}` });
    return { success: false, message: "Folder not found" };
  }

  const workbook = new ExcelJS.Workbook();
  try {
    if (!fs.existsSync(excelFile)) {
      onLog({ type: "error", message: `Excel file not found: ${excelFile}` });
      return { success: false, message: "Excel file not found" };
    }

    await workbook.xlsx.readFile(excelFile);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      onLog({ type: "error", message: "Empty or invalid worksheet!" });
      return { success: false, message: "Invalid worksheet" };
    }

    let successCount = 0;
    let failCount = 0;

    const limit = pLimit(concurrent);
    const tasks: Promise<void>[] = [];

    for (let i = 2; i <= worksheet.actualRowCount; i++) {
      const row = worksheet.getRow(i);
      const fileName = row.getCell(1).text?.trim();
      if (!fileName) continue;

      const filePath = path.join(imagesFolder, fileName);

      const task = limit(async () => {
        if (!fs.existsSync(filePath)) {
          onLog({ type: "warn", message: `File not found: ${fileName}` });
          failCount++;
          return;
        }

        onLog({ type: "info", message: `Injecting metadata: ${fileName}` });

        try {
          const { title, subject, rating, tagsRaw, tagsArray, comment } =
            getRowData(row);

          await exiftool.write(
            filePath,
            {
              Title: title,
              Description: subject,
              Rating: rating,
              Keywords: tagsArray,
              Comment: comment,

              // XP fields for better compatibility with Windows Explorer
              XPTitle: title,
              XPSubject: subject,
              XPKeywords: tagsRaw,
              XPComment: comment,

              // Convert rating to percentage for better compatibility with various platforms
              RatingPercent: rating === 5 ? 99 : rating * 20,
            },
            { writeArgs: ["-overwrite_original"] },
          );

          successCount++;
        } catch (err: unknown) {
          onLog({
            type: "error",
            message: `Failed ${fileName}: ${(err as Error).message}`,
          });
          failCount++;
        }
      });

      tasks.push(task);
    }

    // Run all tasks with concurrency limit
    await Promise.all(tasks);

    onLog({
      type: "success",
      message: `Injection complete! Success: ${successCount}, Failed: ${failCount}`,
    });
    return {
      success: true,
      message: "Injection completed",
      successCount,
      failCount,
    };
  } catch (error: unknown) {
    onLog({
      type: "error",
      message: `Execution error: ${(error as Error).message}`,
    });
    return { success: false, message: "Execution error" };
  } finally {
    await exiftool.end();
  }
}
