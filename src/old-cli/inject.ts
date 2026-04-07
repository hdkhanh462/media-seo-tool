import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import ExcelJS from "exceljs";
import { exiftool } from "exiftool-vendored";
import pLimit from "p-limit";

import { logger } from "./logger";
import { getRowData, pause } from "./utils";

// 1. CLI Arguments Setup
let values: any;
try {
  const args = parseArgs({
    args: Bun.argv,
    options: {
      "images-folder": { type: "string", short: "i" },
      "excel-file": { type: "string", short: "e" },
      concurrent: { type: "string", short: "c" },
      help: { type: "boolean", short: "h" },
    },
    strict: true,
    allowPositionals: true,
  });
  values = args.values;
} catch (e: any) {
  showHelp(e.message);
  process.exit(1);
}

function showHelp(errorMsg?: string) {
  if (errorMsg) logger.error(errorMsg);
  console.log(`
SEO Media Injector
--------------------------------------------------
Usage:
  ./MediaInjector.exe [flags]

Flags:
  -i, --images-folder   Path to media folder (Default: ./my_files)
  -e, --excel-file      Path to data Excel file (Default: data.xlsx)
  -c, --concurrent      Number of concurrent tasks (Default: 5)
  -h, --help            Show this help menu
--------------------------------------------------
  `);
}

if (values.help) {
  showHelp();
  process.exit(0);
}

const FOLDER_PATH = (values["images-folder"] as string) || "./my_files";
const EXCEL_FILE = (values["excel-file"] as string) || "data.xlsx";
const CONCURRENT_LIMIT = parseInt(values.concurrent as string, 10) || 5;

// 2. Main Injection Logic
async function runInjector() {
  logger.info("Starting SEO Media Injector...");
  logger.info(`Target Folder: ${path.resolve(FOLDER_PATH)}`);
  logger.info(`Source Excel: ${path.resolve(EXCEL_FILE)}`);
  logger.info(`Concurrent Tasks: ${CONCURRENT_LIMIT}\n`);

  if (!fs.existsSync(FOLDER_PATH)) {
    logger.error(`Folder not found: ${FOLDER_PATH}`);
    await pause();
    return;
  }

  const workbook = new ExcelJS.Workbook();
  try {
    if (!fs.existsSync(EXCEL_FILE)) {
      logger.error(`Excel file not found: ${EXCEL_FILE}`);
      return;
    }

    await workbook.xlsx.readFile(EXCEL_FILE);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      logger.error("Empty or invalid worksheet!");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    const limit = pLimit(CONCURRENT_LIMIT);
    const tasks: Promise<void>[] = [];

    for (let i = 2; i <= worksheet.actualRowCount; i++) {
      const row = worksheet.getRow(i);
      const fileName = row.getCell(1).text?.trim();
      if (!fileName) continue;

      const filePath = path.join(FOLDER_PATH, fileName);

      const task = limit(async () => {
        if (!fs.existsSync(filePath)) {
          logger.warn(`File not found: ${fileName}`);
          failCount++;
          return;
        }

        logger.info(`Injecting metadata: ${fileName}`);

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
        } catch (err: any) {
          logger.error(`Failed ${fileName}: ${err.message}`);
          failCount++;
        }
      });

      tasks.push(task);
    }

    // Run all tasks with concurrency limit
    await Promise.all(tasks);

    logger.success(
      `Injection complete! Success: ${successCount}, Failed: ${failCount}`,
    );
  } catch (error: any) {
    logger.error(`Execution error: ${error.message}`);
  } finally {
    await exiftool.end();
    await pause();
  }
}

runInjector();
