import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";

import type { MediaInQueue } from "~/shared/types";
import { splitKeywords } from "../utils";
import { checkFileExists } from "./editor.service";

export const importMediaFromExcel = async (
  fullPath: string,
): Promise<MediaInQueue[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fullPath);
  const worksheet = workbook.getWorksheet("SEO Data") || workbook.worksheets[0];

  const results: MediaInQueue[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const name = row.getCell(1).text;
    const title = row.getCell(2).text;
    const description = row.getCell(3).text;
    const comment = row.getCell(4).text;
    const keywordsRaw = row.getCell(5).text;
    const subjectsRaw = row.getCell(6).text;
    const ratingRaw = row.getCell(7).value;
    const author = row.getCell(8).text;

    results.push({
      name: name,
      exif: {
        title: title || undefined,
        description: description || undefined,
        comment: comment || undefined,
        keywords: splitKeywords(keywordsRaw),
        subjects: splitKeywords(subjectsRaw),
        rating: typeof ratingRaw === "number" ? ratingRaw : undefined,
        author: author || undefined,
      },
    });
  });

  return results;
};

export const importMediaFromCSV = async (
  fullPath: string,
): Promise<MediaInQueue[]> => {
  const content = fs.readFileSync(fullPath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  return lines.map((line) => {
    // Simple CSV split, handling basic quoting
    const parts = line.split(",").map((p) => {
      const trimmed = p.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1).replace(/""/g, '"');
      }
      return trimmed;
    });

    const [
      name,
      title,
      description,
      comment,
      keywords,
      subjects,
      rating,
      author,
    ] = parts;

    return {
      name,
      exif: {
        title: title || undefined,
        description: description || undefined,
        comment: comment || undefined,
        keywords: splitKeywords(keywords),
        subjects: splitKeywords(subjects),
        rating: Number(rating) || 0,
        author: author || undefined,
      },
    };
  });
};

export const importMediaFromJSON = async (
  fullPath: string,
): Promise<MediaInQueue[]> => {
  const content = fs.readFileSync(fullPath, "utf-8");
  const data = JSON.parse(content);

  if (Array.isArray(data)) {
    return data.map((item) => {
      return {
        name: item.name,
        exif: {
          title: item.title,
          description: item.description,
          comment: item.comment,
          keywords: splitKeywords(item.keywords),
          subjects: splitKeywords(item.subjects),
          rating: item.rating,
          author: item.author,
        },
      };
    });
  }

  return [];
};

export const importMedia = async (
  fullPath: string,
): Promise<MediaInQueue[]> => {
  const isExist = checkFileExists(fullPath);
  if (!isExist) {
    throw new Error("File not found");
  }

  const ext = path.extname(fullPath).toLowerCase();

  switch (ext) {
    case ".xlsx":
      return importMediaFromExcel(fullPath);
    case ".csv":
      return importMediaFromCSV(fullPath);
    case ".json":
      return importMediaFromJSON(fullPath);
    default:
      throw new Error("Invalid file format");
  }
};
