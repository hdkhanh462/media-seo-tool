import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import ExcelJS from "exceljs";
import { exiftool } from "exiftool-vendored";
import pLimit from "p-limit";

import { logger } from "./logger";
import { getExif, pause } from "./utils";

// 1. CLI Arguments Setup
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    "images-folder": { type: "string", short: "i" },
    "output-excel": { type: "string", short: "o" },
    concurrent: { type: "string", short: "c" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
  allowPositionals: true,
});

const showHelp = () => {
  console.log(`
Media To Excel Extractor
--------------------------------------------------
Usage:
  ./MediaToExcel.exe [flags]

Flags:
  -i, --images-folder   Path to media folder (Default: ./my_files)
  -o, --output-excel    Output Excel filename (Default: data_template.xlsx)
  -c, --concurrent      Number of concurrent tasks (Default: 5)
  -h, --help            Show this help menu
--------------------------------------------------
  `);
};

if (values.help) {
  showHelp();
  process.exit(0);
}

const FOLDER_PATH = (values["images-folder"] as string) || "./my_files";
const OUTPUT_FILE = (values["output-excel"] as string) || "data_template.xlsx";
const CONCURRENT_LIMIT = parseInt(values.concurrent as string, 10) || 5;

// 2. Main Extraction Logic
async function runExtractor() {
  logger.info("Starting Media Metadata Extractor...");
  logger.info(`Target Folder: ${path.resolve(FOLDER_PATH)}`);
  logger.info(`Output Excel: ${path.resolve(OUTPUT_FILE)}`);
  logger.info(`Concurrent Tasks: ${CONCURRENT_LIMIT}\n`);

  if (!fs.existsSync(FOLDER_PATH)) {
    logger.error(`Folder not found: ${FOLDER_PATH}`);
    await pause();
    return;
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

  const files = fs.readdirSync(FOLDER_PATH);
  const mediaExtensions = [".jpg", ".jpeg", ".png", ".mp4", ".mov", ".webp"];

  let processedCount = 0;

  const limit = pLimit(CONCURRENT_LIMIT);
  const tasks: Promise<void>[] = [];
  const rows: any[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!mediaExtensions.includes(ext)) continue;

    const filePath = path.join(FOLDER_PATH, file);

    const task = limit(async () => {
      logger.info(`Reading metadata: ${file}`);

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
      } catch (err: any) {
        logger.warn(`Could not read metadata for ${file}: ${err.message}`);

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
  rows.forEach((row) => worksheet.addRow(row));

  try {
    await workbook.xlsx.writeFile(OUTPUT_FILE);
    logger.success(
      `Successfully exported ${processedCount} files to ${OUTPUT_FILE}`,
    );
  } catch (error: any) {
    logger.error(`Failed to save Excel file: ${error.message}`);
  } finally {
    await exiftool.end();
    await pause();
  }
}

runExtractor();
