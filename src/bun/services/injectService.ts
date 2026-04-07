import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { ExifTool } from "exiftool-vendored";

import { getRowData } from "../../old-cli/utils";

// Helper to get a fresh exiftool instance
function getExiftoolInstance() {
  return new ExifTool();
}

export interface InjectOptions {
  imagesFolder: string;
  excelFile: string;
}

export interface InjectResult {
  success: boolean;
  message: string;
  successCount?: number;
  failCount?: number;
}

export async function injectMetadata(
  options: InjectOptions,
): Promise<InjectResult> {
  const { imagesFolder, excelFile } = options;

  console.log("Starting SEO Media Injector...");
  console.log(`Target Folder: ${path.resolve(imagesFolder)}`);
  console.log(`Source Excel: ${path.resolve(excelFile)}`);

  if (!fs.existsSync(imagesFolder)) {
    console.error(`Folder not found: ${imagesFolder}`);
    return { success: false, message: "Folder not found" };
  }

  const workbook = new ExcelJS.Workbook();
  try {
    if (!fs.existsSync(excelFile)) {
      console.error(`Excel file not found: ${excelFile}`);
      return { success: false, message: "Excel file not found" };
    }

    await workbook.xlsx.readFile(excelFile);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      console.error("Empty or invalid worksheet!");
      return { success: false, message: "Invalid worksheet" };
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 2; i <= worksheet.actualRowCount; i++) {
      const row = worksheet.getRow(i);
      const fileName = row.getCell(1).text?.trim();
      if (!fileName) continue;

      const filePath = path.join(imagesFolder, fileName);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${fileName}`);
        failCount++;
        continue;
      }

      console.log(`Injecting metadata: ${fileName}`);

      // Create a fresh exiftool instance for each file to avoid BatchCluster issues
      const exiftool = getExiftoolInstance();

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
        console.error(`Failed ${fileName}: ${(err as Error).message}`);
        failCount++;
      } finally {
        // Clean up the exiftool instance
        await exiftool.end();
      }
    }

    console.log(
      `Injection complete! Success: ${successCount}, Failed: ${failCount}`,
    );
    return {
      success: true,
      message: "Injection completed",
      successCount,
      failCount,
    };
  } catch (error: unknown) {
    console.error(`Execution error: ${(error as Error).message}`);
    return { success: false, message: "Execution error" };
  }
}
