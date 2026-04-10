import type ExcelJS from "exceljs";
import type { Tags } from "exiftool-vendored";

export const getRowData = (row: ExcelJS.Row) => {
  const title = row.getCell(2).text?.trim() || "";
  const subject = row.getCell(3).text?.trim() || "";
  const ratingVal = row.getCell(4).value;
  const rating = Number(ratingVal) || 0;
  const tagsRaw = row.getCell(5).text?.trim() || "";
  const comment = row.getCell(6).text?.trim() || "";

  const tagsArray = tagsRaw
    ? tagsRaw
        .split(";")
        .map((t) => t.trim())
        .filter((v) => v)
    : [];

  return {
    title,
    subject,
    rating,
    tagsRaw,
    tagsArray,
    comment,
  };
};

export const getExif = (tags: Tags) => {
  const title = tags.Title || tags.XPTitle || "";
  const subject = tags.Description || tags.XPSubject || "";
  const comments = tags.Comment || tags.XPComment || "";
  const rating = tags.Rating || 0;
  const tagArray = Array.isArray(tags.Keywords)
    ? tags.Keywords.join(";")
    : tags.XPKeywords || "";

  return {
    title,
    subject,
    rating,
    tagArray,
    comments,
  };
};

export const splitKeywords = (value?: string | string[]) => {
  if (!value) return undefined;
  return typeof value === "string"
    ? value.split(";").map((k) => k.trim())
    : value;
};
