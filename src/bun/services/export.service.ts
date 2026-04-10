import fs from "node:fs";
import ExcelJS from "exceljs";

import type {
  ExportMediaOptions,
  ExportToCSVOptions,
  ExportToExcelOptions,
  ExportToJSONOptions,
  MediaWithExif,
} from "~/shared/types";
import { checkFileExists } from "./editor.service";

type TransformedMedia = {
  name: string;
  title?: string;
  description?: string;
  comment?: string;
  keywords?: string;
  subjects?: string;
  rating?: number;
  author?: string;
};

type ExportFn<TOptions = never> = (
  fullPath: string,
  transformedMedia: TransformedMedia[],
  options?: TOptions,
) => void;

export const transformMedia = (media: MediaWithExif[]): TransformedMedia[] => {
  return media.map((item) => {
    return {
      name: item.name,
      title: item.exif.title,
      description: item.exif.description,
      comment: item.exif.comment,
      keywords: item.exif.keywords?.join(";") || undefined,
      subjects: item.exif.subjects?.join(";") || undefined,
      rating: item.exif.rating,
      author: item.exif.author,
    };
  });
};

export const exportMediaToExcel: ExportFn<ExportToExcelOptions> = async (
  fullPath,
  transformedMedia,
  options,
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(options?.sheetName || "SEO Data");

  worksheet.columns = [
    { header: "Name", key: "name", width: 30 },
    { header: "Title", key: "title", width: 40 },
    { header: "Description", key: "description", width: 40 },
    { header: "Comment", key: "comment", width: 40 },
    { header: "Keywords", key: "keywords", width: 40 },
    { header: "Subjects", key: "subjects", width: 30 },
    { header: "Rating", key: "rating", width: 10 },
    { header: "Author", key: "author", width: 40 },
  ];

  if (options?.autoFilter) {
    worksheet.autoFilter = {
      from: "A1",
      to: "H1",
    };
  }

  if (options?.freezeHeader) {
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  worksheet.addRows(transformedMedia);

  // Auto-adjust column widths
  worksheet.columns.forEach((col) => {
    col.width = Math.max(
      10,
      ...transformedMedia.map(
        (row) => String(row[col.key as keyof TransformedMedia] || "").length,
      ),
    );
  });

  await workbook.xlsx.writeFile(fullPath);
};

export const exportMediaToCSV: ExportFn<ExportToCSVOptions> = async (
  fullPath,
  transformedMedia,
  options,
) => {
  const delimiter = options?.delimiter || ",";
  const escapeValue = (val: unknown) => {
    if (val == null) return "";
    const str = String(val);

    if (options?.quoteValues) {
      return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
  };

  const csvContent = transformedMedia
    .map((item) => {
      return [
        item.name,
        item.title,
        item.description,
        item.comment,
        item.keywords,
        item.subjects,
        item.rating,
        item.author,
      ]
        .map(escapeValue)
        .join(delimiter);
    })
    .join("\n");

  fs.writeFileSync(fullPath, csvContent, {
    encoding: options?.encoding || "utf-8",
  });
};

export const exportMediaToJSON: ExportFn<ExportToJSONOptions> = async (
  fullPath,
  transformedMedia,
  options,
) => {
  const data = options?.includeNull
    ? transformedMedia
    : transformedMedia.map((item) =>
        Object.fromEntries(Object.entries(item).filter(([_, v]) => v != null)),
      );

  const jsonContent = options?.minify
    ? JSON.stringify(data)
    : JSON.stringify(data, null, 2);

  fs.writeFileSync(fullPath, jsonContent);
};

export const exportMedia = (options: ExportMediaOptions): boolean => {
  const { fullPath, type, media, overwrite } = options;

  const isExist = checkFileExists(fullPath);
  if (!overwrite && isExist) {
    throw new Error("File already exists");
  }

  const transformedMedia = transformMedia(media);

  switch (type) {
    case "xlsx":
      exportMediaToExcel(fullPath, transformedMedia, options.meta);
      break;
    case "csv":
      exportMediaToCSV(fullPath, transformedMedia, options.meta);
      break;
    case "json":
      exportMediaToJSON(fullPath, transformedMedia, options.meta);
      break;
    default:
      throw new Error("Invalid file format");
  }

  return true;
};
