import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";

import type { MediaWithExif } from "~/shared/types";
import { splitKeywords } from "../utils";
import { checkFileExists } from "./editor.service";

export const importMediaFromExcel = async (
  fullPath: string,
): Promise<MediaWithExif[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(fullPath);
  const worksheet = workbook.getWorksheet("SEO Data") || workbook.worksheets[0];

  const results: MediaWithExif[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const fileName = row.getCell(1).text;
    const title = row.getCell(2).text;
    const description = row.getCell(3).text;
    const comment = row.getCell(4).text;
    const keywordsRaw = row.getCell(5).text;
    const subjectsRaw = row.getCell(6).text;
    const ratingRaw = row.getCell(7).value;
    const author = row.getCell(8).text;

    results.push({
      name: fileName,
      exif: {
        title: title || undefined,
        description: description || undefined,
        comment: comment || undefined,
        keywords: splitKeywords(keywordsRaw),
        subjects: splitKeywords(subjectsRaw),
        rating: typeof ratingRaw === "number" ? ratingRaw : undefined,
        author: author || undefined,
      },
    } as MediaWithExif);
  });

  return results;
};

export const importMediaFromCSV = async (
  fullPath: string,
): Promise<MediaWithExif[]> => {
  const content = fs.readFileSync(fullPath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  return lines.map((line) => {
    const [
      name,
      title,
      description,
      comment,
      keywords,
      subjects,
      rating,
      author,
    ] = line.split(",");
    return {
      name,
      exif: {
        title,
        description,
        comment,
        keywords: splitKeywords(keywords),
        subjects: splitKeywords(subjects),
        rating: Number(rating) || 0,
        author,
      },
    } as MediaWithExif;
  });
};

export const importMediaFromJSON = async (
  fullPath: string,
): Promise<MediaWithExif[]> => {
  const content = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(content) as MediaWithExif[];
};

export const importMedia = async (fullPath: string) => {
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
